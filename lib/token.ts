"use server";

import { v4 as uuidv4 } from "uuid";
import {
  createPasswordResetToken,
  createVerificationToken,
  deletePasswordResetToken,
  deleteVerificationToken,
} from "@/lib/auth";
import {
  getPasswordResetTokenByEmail,
  getVerificationTokenByEmail,
} from "./auth";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationToken(existingToken.identifier);
  }

  const verficationToken = await createVerificationToken(email, token, expires);

  return verficationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
      await deletePasswordResetToken(existingToken.id);
    }

    const passwordResetToken = await createPasswordResetToken(
      email,
      token,
      expires
    );

    return passwordResetToken;
  } catch (error) {
    console.error("Error generating password reset token:", error);
    throw new Error("An unexpected error has occured.");
  }
};
