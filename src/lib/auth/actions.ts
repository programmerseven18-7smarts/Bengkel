"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createAuthSession, clearAuthSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

export type SignInState = {
  error?: string;
  email?: string;
};

export const signInAction = async (
  _previousState: SignInState,
  formData: FormData
): Promise<SignInState> => {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return {
      error: "Email dan password wajib diisi.",
      email,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      passwordHash: true,
      status: true,
      role: {
        select: {
          status: true,
        },
      },
    },
  });

  const validPassword =
    user?.passwordHash &&
    (await verifyPassword(password, user.passwordHash));

  if (!user || !validPassword || user.status !== "AKTIF" || user.role?.status !== "AKTIF") {
    return {
      error: "Email atau password salah.",
      email,
    };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      terakhirLogin: new Date(),
    },
  });

  await createAuthSession(user.id, remember);
  redirect("/");
};

export const signOutAction = async () => {
  await clearAuthSession();
  redirect("/signin");
};
