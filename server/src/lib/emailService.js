import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.EMAIL_FROM || 'no-reply@example.com';

let transporter;

export function getTransporter() {
  if (transporter) return transporter;
  if (smtpHost) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined
    });
  } else {
    // Dev fallback: do not send real emails, just log the message
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

export async function sendOtpEmail({ to, otp }) {
  const html = `
    <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto;">
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <div style="font-size:28px; font-weight:bold; letter-spacing:4px;">${otp}</div>
      <p>This code will expire in 10 minutes. If you did not request this, please ignore.</p>
    </div>
  `;

  await getTransporter().sendMail({
    from: fromEmail,
    to,
    subject: 'Your verification code',
    html
  });

  if (!smtpHost) {
    console.info('[DEV] OTP for', to, '=>', otp);
  }
}


