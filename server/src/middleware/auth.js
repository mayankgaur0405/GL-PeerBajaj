import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function authRequired(req, res, next) {
  const token = req.cookies?.accessToken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
  
  console.log('Auth middleware - URL:', req.url);
  console.log('Auth middleware - Method:', req.method);
  console.log('Auth middleware - Token found:', !!token);
  console.log('Auth middleware - Cookies:', req.cookies);
  console.log('Auth middleware - Headers:', req.headers.authorization);
  
  if (!token) {
    console.log('Auth middleware - No token found, returning 401');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'secret');
    console.log('Auth middleware - Decoded token:', decoded);
    req.userId = decoded.id;
    
    // Fetch and attach user object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('Auth middleware - User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    console.log('Auth middleware - User authenticated:', { id: user._id, name: user.name, username: user.username });
    next();
  } catch (e) {
    console.error('Auth middleware - JWT verification error:', e.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export async function attachCurrentUser(req, res, next) {
  if (!req.userId) return next();
  const user = await User.findById(req.userId).select('-password');
  req.user = user;
  next();
}

// Export 'auth' as an alias for 'authRequired' for backward compatibility
export const auth = authRequired;


