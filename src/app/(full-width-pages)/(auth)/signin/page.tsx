import SignInForm from "@/components/auth/SignInForm";
import { getCurrentUser } from "@/lib/auth/session";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Auto7",
  description: "Halaman login sistem manajemen bengkel Auto7",
};

export default async function SignIn() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <SignInForm />;
}
