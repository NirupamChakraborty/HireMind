import { Router } from 'express';
import {
  generateInterviewReportController,
  generateResumePdfController,
  getAllInterviewReportsController,
  getInterviewReportByIdController,
} from '../controllers/interview.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/files.middleware.js';

const router = Router();

// /api/interview

/**
 * @route POST /api/interview
 * @description Generate a new interview report from resume PDF, self description, and job description.
 * @access Private
 */
router.post('/', authUser, upload.single('resume'), generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get a single interview report by id.
 * @access Private
 */
router.get('/report/:interviewId', authUser, getInterviewReportByIdController);

/**
 * @route GET /api/interview
 * @description Get all interview reports for the logged-in user.
 * @access Private
 */
router.get('/', authUser, getAllInterviewReportsController);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate a tailored resume PDF for a given interview report.
 * @access Private
 */
router.post('/resume/pdf/:interviewReportId', authUser, generateResumePdfController);

export default router;
