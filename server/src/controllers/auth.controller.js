import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import tokenBlacklistModel from '../models/blacklist.model.js';
import userModel from '../models/user.model.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

/**
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUserController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email and password' });
    }

    if (/\S+@\S+\.\S+/.test(username)) {
      return res.status(400).json({ message: 'Username cannot be an email address' });
    }

    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email address' : 'username';
      return res.status(409).json({ message: `Account already exists with this ${field}` });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hash });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, COOKIE_OPTIONS).status(201).json({
      message: 'User registered successfully',
      user: sanitizeUser(user),
    });
  } catch (error) {
    // Mongo duplicate key race (two requests slipping past the findOne check)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'username or email';
      return res.status(409).json({ message: `Account already exists with this ${field}` });
    }
    // Mongoose schema validation errors (e.g. minlength)
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]?.message || 'Invalid input';
      return res.status(400).json({ message: firstError });
    }
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, COOKIE_OPTIONS).status(200).json({
      message: 'User logged in successfully',
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

/**
 * @route GET /api/auth/logout
 * @access Public
 */
export const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      await tokenBlacklistModel.create({ token });
    }

    res.clearCookie('token', COOKIE_OPTIONS);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Logout failed' });
  }
};

/**
 * @route GET /api/auth/get-me
 * @access Private
 */
export const getMeController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch user' });
  }
};
