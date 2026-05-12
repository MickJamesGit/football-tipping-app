"use server";

import path from "path";
import fs from "fs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  // Access the template file from the public directory
  const htmlTemplatePath = path.join(
    process.cwd(),
    "public/emails/send-verification-email.html",
  );
  const htmlBody = fs.readFileSync(htmlTemplatePath, "utf8");

  // Replace placeholders with dynamic content
  const htmlContent = htmlBody.replace("{confirmLink}", confirmLink);

  // Log the result to verify
  console.log(htmlContent);

  // Send email using Resend
  await resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to: email,
    subject: "Confirm your email",
    html: htmlContent,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/login/new-password?token=${token}`;

  // Access the template file from the public directory
  const htmlTemplatePath = path.join(
    process.cwd(),
    "public/emails/password-reset-email.html",
  );
  const htmlBody = fs.readFileSync(htmlTemplatePath, "utf8");

  // Replace placeholders with dynamic content
  const htmlContent = htmlBody.replace("{resetLink}", resetLink);

  // Log the result to verify
  console.log(htmlContent);

  // Send email using Resend
  await resend.emails.send({
    from: process.env.FROM_EMAIL as string,
    to: email,
    subject: "Reset your password",
    html: htmlContent,
  });
};
