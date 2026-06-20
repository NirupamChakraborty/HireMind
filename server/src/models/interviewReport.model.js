import mongoose from 'mongoose';

const technicalQuestionSchema = new mongoose.Schema(
  {
    question:  { type: String, required: true },
    intention: { type: String, required: true },
    answer:    { type: String, required: true },
  },
  { _id: false }
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question:  { type: String, required: true },
    intention: { type: String, required: true },
    answer:    { type: String, required: true },
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
  {
    skill:    { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
  {
    day:   { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String, required: true }],
  },
  { _id: false }
);

const interviewReportSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    title:           { type: String, required: true },
    jobDescription:  { type: String, required: true },
    resume:          { type: String, default: '' },
    selfDescription: { type: String, default: '' },
    matchScore:      { type: Number, min: 0, max: 100, default: 0 },
    technicalQuestions:  [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps:           [skillGapSchema],
    preparationPlan:     [preparationPlanSchema],
  },
  { timestamps: true }
);

const interviewReportModel = mongoose.model('interviewReports', interviewReportSchema);
export default interviewReportModel;
