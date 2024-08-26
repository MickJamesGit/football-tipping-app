"use server";

import prisma from "@/prisma";
import { PasswordResetToken, Session, VerificationToken } from "@prisma/client";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
} from "@/lib/schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/user";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "@/lib/token";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { auth, signIn } from "@/auth";

export async function getPasswordResetTokenByToken(
  token: string
): Promise<PasswordResetToken | null> {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: token,
      },
    });
    return resetToken;
  } catch (error) {
    console.error("Error fetching password reset token:", error);
    throw new Error("An unexpected error has occured.");
  }
}

export async function getVerificationTokenByToken(
  token: string
): Promise<VerificationToken | null> {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: token,
      },
    });
    return verificationToken;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    throw new Error("An unexpected error has occured.");
  }
}

export async function getPasswordResetTokenByEmail(
  email: string
): Promise<PasswordResetToken | null> {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        email: email,
      },
    });
    return resetToken;
  } catch (error) {
    console.error("Error fetching password reset token:", error);
    throw new Error("An unexpected error has occured.");
  }
}

export async function getVerificationTokenByEmail(
  email: string
): Promise<VerificationToken | null> {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email: email,
      },
    });
    return verificationToken;
  } catch (error) {
    console.error("Error fetching verification token:", error);
    throw new Error("An unexpected error has occured.");
  }
}

export async function googleAuthenticate() {
  try {
    const session = await auth();
    console.log("Session:", session);
    if (session) {
      redirect("/dashboard");
    } else {
      console.log("No session found, signing in...");
      await signIn("google", { redirectTo: "/dashboard" });
    }
  } catch (error) {
    console.error("Error authenticating with Google:");
    throw new Error("Failed to authenticate.");
  }
}

export async function facebookAuthenticate() {
  try {
    const session = await auth();
    if (session) {
      redirect("/dashboard");
    } else {
      await signIn("facebook", { redirectTo: "/dashboard" });
    }
  } catch (error) {
    console.error("Error authenticating with facebook:", error);
    throw new Error("Failed to authenticate.");
  }
}

export async function deleteVerificationToken(token: string): Promise<boolean> {
  try {
    const result = await prisma.verificationToken.delete({
      where: { token },
    });
    return result !== null;
  } catch {
    return false;
  }
}

export async function deletePasswordResetToken(
  token: string
): Promise<boolean> {
  try {
    const result = await prisma.passwordResetToken.delete({
      where: { token },
    });
    return result !== null;
  } catch {
    return false;
  }
}

export const verifyEmail = async (token: string) => {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { error: "Invalid or expired token." };
  }

  const { email, expires } = verificationToken;

  if (dayjs().isAfter(dayjs(expires))) {
    return { error: "Token has expired." };
  }

  const now = dayjs().toISOString();
  await prisma.user.update({
    where: { email },
    data: { emailVerified: now },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return { success: "Email verified successfully." };
};

export async function createPasswordResetToken(
  email: string,
  token: string,
  expiresAt: Date
): Promise<PasswordResetToken> {
  try {
    const passwordResetToken = await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });
    return passwordResetToken;
  } catch (error) {
    console.error("Error creating password reset token:", error);
    throw new Error("An unexpected error has occured.");
  }
}

export async function createVerificationToken(
  email: string,
  token: string,
  expires: Date
): Promise<VerificationToken> {
  try {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return verificationToken;
  } catch (error) {
    console.error("Error creating verification token:", error);
    throw new Error("An unexpected error has occured.");
  }
}

export async function updatePassword(userId: string, hashedPassword: string) {
  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return result;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Could not update password");
  }
}

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email and/or password." };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password) {
    return { error: "Invalid email and/or password." };
  }

  if (!(await bcrypt.compare(password, existingUser.password))) {
    return {
      error: "Invalid email and/or password.",
    };
  }

  if (!existingUser.emailVerified) {
    return {
      error: "Email not verified.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: callbackUrl || "/dashboard",
    });

    return { success: true };
  } catch (error) {
    console.log("Error logging in:", error);
    throw new Error("An unexpected error has occured.");
  }
};

export async function createSession(
  userId: string,
  sessionToken: string,
  expires: Date
): Promise<Session | null> {
  try {
    const session = await prisma.session.create({
      data: {
        userId: userId,
        sessionToken: sessionToken,
        expires: expires,
      },
    });
    return session;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "An error has occurred." };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid password." };
  }

  const { password } = validatedFields.data;

  try {
    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return { error: "Password reset has expired." };
    }

    const hasExpired = new Date(existingToken.expiresAt) < new Date();

    if (hasExpired) {
      return { error: "Password reset has expired." };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Unable to update password." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await updatePassword(existingUser.id, hashedPassword);

    await deletePasswordResetToken(existingToken.token);

    return { success: "Your password has been updated." };
  } catch (error) {
    console.error("Error processing password reset:", error);
    throw new Error("An unexpected error has occured.");
  }
};

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email." };
  }

  const { email } = validatedFields.data;

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return {
        success:
          "An email has been sent with instructions to reset your password.",
      };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    return {
      success:
        "An email has been sent with instructions to reset your password.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "An unexpected error has occured." };
  }
};

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields submitted. Review entries and resubmit." };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email is already registered." };
  }

  try {
    await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: { id: true },
      });

      const userId = newUser.id;

      await prisma.account.create({
        data: {
          userId: userId,
          type: "credentials",
          provider: "credentials",
          providerAccountId: userId.toString(),
        },
      });

      const verificationToken = await generateVerificationToken(email);

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An error occurred during signup." };
  }
};
