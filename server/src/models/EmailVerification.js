import mongoose from 'mongoose';

const EmailVerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    consumed: { type: Boolean, default: false },
    context: { type: String, enum: ['signup', 'reset'], default: 'signup' }
  },
  { timestamps: true }
);

EmailVerificationSchema.index({ email: 1, context: 1, consumed: 1 });

export const EmailVerification = mongoose.model('EmailVerification', EmailVerificationSchema);


