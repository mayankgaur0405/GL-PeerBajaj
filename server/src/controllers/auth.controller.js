import { User } from '../models/User.js';
import { EmailVerification } from '../models/EmailVerification.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { validateGLBITMEmail, validateEmailForAuth } from '../utils/emailValidation.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendOtpEmail } from '../lib/emailService.js';
import jwt from 'jsonwebtoken';

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

// ===== OTP Signup Flow =====

function generateNumericOtp(length = 6) {
  const bytes = crypto.randomBytes(length);
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += (bytes[i] % 10).toString();
  }
  return otp;
}

export async function startSignup(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const emailValidation = validateGLBITMEmail(email);
    if (!emailValidation.isValid) return res.status(400).json({ message: emailValidation.message });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const otp = generateNumericOtp(6);
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailVerification.deleteMany({ email, context: 'signup', consumed: false });
    await EmailVerification.create({ email, otpHash, expiresAt, context: 'signup' });

    await sendOtpEmail({ to: email, otp });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const record = await EmailVerification.findOne({ email, context: 'signup', consumed: false }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ message: 'No OTP pending for this email' });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
    if (record.attempts >= record.maxAttempts) return res.status(429).json({ message: 'Too many attempts' });

    const ok = await bcrypt.compare(otp, record.otpHash);
    record.attempts += 1;
    if (!ok) {
      await record.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    record.consumed = true;
    await record.save();

    // issue a short-lived token to allow completing signup
    const completeToken = signAccessToken({ email, stage: 'signup_verified' });
    res.json({ message: 'OTP verified', completeToken });
  } catch (err) {
    next(err);
  }
}

export async function completeSignup(req, res, next) {
  try {
    const { completeToken, name, username, password } = req.body;
    if (!completeToken || !name || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let decoded;
    try {
      decoded = jwtVerifySignupToken(completeToken);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    if (decoded.stage !== 'signup_verified' || !decoded.email) {
      return res.status(401).json({ message: 'Invalid token stage' });
    }

    const email = decoded.email;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: 'Email or username already in use' });

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

function jwtVerifySignupToken(token) {
  return jwt.verify(token, process.env.JWT_SIGNUP_SECRET || process.env.JWT_REFRESH_SECRET || 'refreshsecret');
}


