import interviewReportModel from '../models/interviewReport.model.js';
import { generateInterviewReport, generateResumePdf } from '../services/ai.services.js';
import { extractTextFromPdf } from '../utils/pdfParser.js';

/**
 * @route POST /api/interview
 * @access Private
 */
export const generateInterviewReportController = async (req, res) => {
  try {
    const resumeFile = req.file;
    const { selfDescription, jobDescription } = req.body;

    if (!resumeFile) {
      return res.status(400).json({ message: 'Resume PDF is required' });
    }
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const resumeText = await extractTextFromPdf(resumeFile.buffer);

    const aiReport = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    // If the AI returned no questions at all, something went wrong upstream
    // (bad schema, content filter, truncated response) — don't silently
    // save a hollow report with fallback values.
    if (!aiReport?.technicalQuestions?.length && !aiReport?.behavioralQuestions?.length) {
      console.error('AI returned an empty report:', JSON.stringify(aiReport));
      return res.status(502).json({
        message: 'The AI did not return a usable report. Please try again.',
      });
    }

    // aiReport already matches the Mongo schema shape 1:1 — no remapping needed.
    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      title: aiReport.title || 'Interview Report',
      matchScore: aiReport.matchScore ?? 70,
      technicalQuestions: aiReport.technicalQuestions || [],
      behavioralQuestions: aiReport.behavioralQuestions || [],
      skillGaps: aiReport.skillGaps || [],
      preparationPlan: aiReport.preparationPlan || [],
    });

    res.status(201).json({
      message: 'Interview report generated successfully',
      interviewReport,
    });
  } catch (error) {
    console.error(error);
    const isOverloaded = /overloaded/i.test(error.message || '');
    res.status(isOverloaded ? 503 : 500).json({
      message: error.message || 'Failed to generate interview report',
    });
  }
};

/**
 * @route GET /api/interview/report/:interviewId
 * @access Private
 */
export const getInterviewReportByIdController = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ message: 'Interview report not found' });
    }

    res.status(200).json({ message: 'Interview report fetched successfully', interviewReport });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch interview report' });
  }
};

/**
 * @route GET /api/interview
 * @access Private
 */
export const getAllInterviewReportsController = async (req, res) => {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('title matchScore createdAt');

    res.status(200).json({
      message: 'Interview reports fetched successfully',
      interviewReports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch interview reports' });
  }
};

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @access Private
 */
export const generateResumePdfController = async (req, res) => {
  try {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ message: 'Interview report not found' });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate resume PDF' });
  }
};
