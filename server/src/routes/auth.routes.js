import { Router } from 'express';
import {
  getMeController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route POST /api/auth/register
 * @access Public
 */
router.post('/register', registerUserController);

/**
 * @route POST /api/auth/login
 * @access Public
 */
router.post('/login', loginUserController);

/**
 * @route GET /api/auth/logout
 * @access Public
 */
router.get('/logout', logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @access Private
 */
router.get('/get-me', authUser, getMeController);

export default router;
