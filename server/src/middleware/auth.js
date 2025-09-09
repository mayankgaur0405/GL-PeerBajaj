import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export function authRequired(req, res, next) {
  const token = req.cookies?.accessToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export async function attachCurrentUser(req, res, next) {
  if (!req.userId) return next();
  const user = await User.findById(req.userId).select('-password');
  req.user = user;
  next();
}


