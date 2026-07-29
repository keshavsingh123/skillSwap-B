import nodemailer from "nodemailer";

import { welcomeEmailTemplate } from "../emails/welcome.template.js";

import { loginAlertEmailTemplate } from "../emails/login-alert.template.js";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,

    port: Number(process.env.MAIL_PORT),

    secure: process.env.MAIL_SECURE === "true",

    auth: {
      user: process.env.MAIL_USER,

      pass: process.env.MAIL_PASSWORD,
    },
  });
}

async function sendEmail({ to, subject, html }) {
  const transporter = createTransporter();

  console.log("Attempting to send email to:", to);

  const info = await transporter.sendMail({
    from: {
      name: process.env.MAIL_FROM_NAME || "SkillSwap",
      address: process.env.MAIL_FROM_EMAIL,
    },
    to,
    subject,
    html,
  });

  console.log("Email sent successfully:", {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  });

  return info;
}

export async function sendWelcomeEmail(user) {
  return sendEmail({
    to: user.email,

    subject: "Welcome to SkillSwap 🎉",

    html: welcomeEmailTemplate({
      name: user.name,
    }),
  });
}

export async function sendLoginAlertEmail({ user, sessionMetadata }) {
  return sendEmail({
    to: user.email,

    subject: "New login detected - SkillSwap",

    html: loginAlertEmailTemplate({
      name: user.name,

      ipAddress: sessionMetadata.ipAddress,

      userAgent: sessionMetadata.userAgent,

      loginTime: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
    }),
  });
}
export async function verifyEmailConnection() {
  const transporter = createTransporter();

  try {
    await transporter.verify();

    console.log("✅ Gmail SMTP connection successful");

    return true;
  } catch (error) {
    console.error("❌ Gmail SMTP connection failed:", error.message);

    return false;
  }
}
