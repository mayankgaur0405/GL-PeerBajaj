import jwt from 'jsonwebtoken';

export function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'secret', { expiresIn: '15m' });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refreshsecret', { expiresIn: '7d' });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refreshsecret');
}


