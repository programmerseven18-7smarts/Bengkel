import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Daftar | Auto7",
  description: "Registrasi akun Auto7 dinonaktifkan untuk demo.",
};

export default function SignUp() {
  redirect("/signin");
}
