import { GoogleGenAI, Type } from '@google/genai';
import puppeteer from 'puppeteer';

// NOTE: must match the variable name defined in .env (GEMINI_API_KEY)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = 'gemini-2.5-flash';

// ── IMPORTANT ──────────────────────────────────────────────────────────────
// Gemini's `responseSchema` does NOT accept arbitrary JSON Schema (and does
// NOT accept the $ref/definitions output that zod-to-json-schema produces,
// even with the openApi3 target). It only understands its own restricted
// schema format built from `Type.OBJECT` / `Type.ARRAY` / `Type.STRING` /
// `Type.NUMBER` etc, with `properties`, `items`, `required`, and `enum`.
// Passing anything else is silently ignored — Gemini falls back to whatever
// shape it infers from the prompt text alone (snake_case keys, flattened
// arrays, stringified JSON inside strings — exactly what we were seeing).
// Schemas below are hand-written in that native format so there is no
// lossy translation step.
const interviewReportSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "The job title/position, e.g. 'Frontend Engineer'",
    },
    matchScore: {
      type: Type.NUMBER,
      description: '0-100 score of how well the candidate matches the job',
    },
    technicalQuestions: {
      type: Type.ARRAY,
      description: 'Exactly 3 technical questions with intention and answer guidance',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'A technical interview question' },
          intention: { type: Type.STRING, description: "The interviewer's intention behind asking it" },
          answer: { type: Type.STRING, description: 'Guidance on how to answer it well' },
        },
        required: ['question', 'intention', 'answer'],
      },
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      description: 'Exactly 3 behavioral questions with intention and answer guidance',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'A behavioral interview question' },
          intention: { type: Type.STRING, description: "The interviewer's intention behind asking it" },
          answer: { type: Type.STRING, description: 'Guidance on how to answer it well' },
        },
        required: ['question', 'intention', 'answer'],
      },
    },
    skillGaps: {
      type: Type.ARRAY,
      description: 'Up to 4 skill gaps',
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING, description: 'A skill the candidate is lacking' },
          severity: {
            type: Type.STRING,
            enum: ['low', 'medium', 'high'],
            description: 'How important this gap is',
          },
        },
        required: ['skill', 'severity'],
      },
    },
    preparationPlan: {
      type: Type.ARRAY,
      description: 'A 5-day preparation plan',
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER, description: 'Day number starting from 1' },
          focus: { type: Type.STRING, description: 'Main focus of this day' },
          tasks: {
            type: Type.ARRAY,
            description: 'Tasks to complete on this day',
            items: { type: Type.STRING },
          },
        },
        required: ['day', 'focus', 'tasks'],
      },
    },
  },
  required: ['title', 'matchScore', 'technicalQuestions', 'behavioralQuestions', 'skillGaps', 'preparationPlan'],
};

const resumePdfSchema = {
  type: Type.OBJECT,
  properties: {
    html: { type: Type.STRING, description: 'The full HTML content of the tailored resume' },
  },
  required: ['html'],
};

/**
 * Calls Gemini with automatic retry on transient 503 "model overloaded"
 * errors, using exponential backoff. Throws a clean, user-facing error
 * after exhausting retries.
 */
const generateContentWithRetry = async (params, { retries = 3, baseDelayMs = 1500 } = {}) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error) {
      lastError = error;
      const status = error?.status || error?.error?.code;
      const isOverloaded = status === 503 || error?.error?.status === 'UNAVAILABLE';

      if (!isOverloaded || attempt === retries) {
        break;
      }

      const delay = baseDelayMs * 2 ** attempt;
      console.warn(`Gemini overloaded (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  const status = lastError?.status || lastError?.error?.code;
  if (status === 503 || lastError?.error?.status === 'UNAVAILABLE') {
    throw new Error('The AI service is currently overloaded. Please try again in a minute.');
  }
  throw new Error('Failed to generate content from the AI service. Please try again.');
};

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
  const prompt = `
Generate an interview report for a candidate.

STRICT RULES:
- Return ONLY valid JSON matching the schema exactly — use the exact field names given in the schema (camelCase), not your own naming.
- Keep answers SHORT (max 3-4 lines each).
- Limit:
  - exactly 3 technical questions
  - exactly 3 behavioral questions
  - up to 4 skill gaps
  - exactly 5 days in the preparation plan
- severity MUST be one of: "low", "medium", "high"
- day MUST be a number, not a string
- tasks MUST be an array of strings
- Do NOT nest JSON as a string inside any field. Every field must be the actual typed value (object, array, string, or number), never a JSON-encoded string.

Candidate data:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

  const response = await generateContentWithRetry({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: interviewReportSchema,
    },
  });

  let parsed;
  try {
    parsed = JSON.parse(response.text);
  } catch (e) {
    console.error('Invalid JSON from AI:', response.text);
    throw new Error('The AI returned a malformed response. Please try again.');
  }

  return parsed;
};

export const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

export const generateResumePdf = async ({ resume, selfDescription, jobDescription }) => {
  const prompt = `Generate a resume for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Respond with a JSON object with a single field "html" containing the HTML content of the resume.
The resume should be tailored for the given job description, highlighting the candidate's strengths
and relevant experience. It should be well-formatted, professional, ATS-friendly, and 1-2 pages
when rendered to PDF. It should read like a real human-written resume, not an AI-generated one.`;

  const response = await generateContentWithRetry({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: resumePdfSchema,
    },
  });

  let jsonContent;
  try {
    jsonContent = JSON.parse(response.text);
  } catch (e) {
    console.error('Invalid JSON from AI:', response.text);
    throw new Error('The AI returned a malformed response. Please try again.');
  }

  return generatePdfFromHtml(jsonContent.html);
};