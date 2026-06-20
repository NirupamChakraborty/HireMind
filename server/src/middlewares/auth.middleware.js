import jwt from 'jsonwebtoken';
import tokenBlacklistModel from '../models/blacklist.model.js';

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, token is missing' });
    }

    const blacklistedToken = await tokenBlacklistModel.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Unauthorized, token is invalid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized, token is invalid' });
  }
};
