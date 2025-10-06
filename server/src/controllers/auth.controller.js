import { User } from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { validateGLBITMEmail, validateEmailForAuth } from '../utils/emailValidation.js';

export async function register(req, res, next) {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate email domain
    const emailValidation = validateGLBITMEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }
    
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Email or username already in use' });
    const user = await User.create({ name, email, password, username, isEmailVerified: true, emailVerifiedAt: new Date() });
    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });
    res
      .cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax' })
      .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' })
      .status(201)
      .json({ user: sanitize(user), accessToken });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ message: 'Missing credentials' });
    
    // Validate email domain if it looks like an email
    const emailValidation = validateEmailForAuth(emailOrUsername);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }
    
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });
    const isProduction = process.env.NODE_ENV === 'production';
    res
      .cookie('accessToken', accessToken, { 
        httpOnly: true, 
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      .cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .json({ user: sanitize(user), accessToken });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = verifyRefreshToken(token);
    const accessToken = signAccessToken({ id: decoded.id });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, { 
      httpOnly: true, 
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      maxAge: 15 * 60 * 1000 // 15 minutes
    }).json({ accessToken });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie('accessToken').clearCookie('refreshToken').json({ message: 'Logged out' });
}

function sanitize(user) {
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

// ===== Direct Signup Flow =====

export async function startSignup(req, res, next) {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const emailValidation = validateGLBITMEmail(email);
    if (!emailValidation.isValid) return res.status(400).json({ message: emailValidation.message });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ message: 'Email or username already in use' });

    const user = await User.create({ name, email, username, password, isEmailVerified: true, emailVerifiedAt: new Date() });
    const accessToken = signAccessToken({ id: user._id });
    const refreshToken = signRefreshToken({ id: user._id });
    const isProduction = process.env.NODE_ENV === 'production';
    res
      .cookie('accessToken', accessToken, { 
        httpOnly: true, 
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 15 * 60 * 1000
      })
      .cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(201)
      .json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}



