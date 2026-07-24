import SignupForm from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입 | SD HOTEL",
  description: "SD HOTEL & Suites 회원가입 페이지입니다.",
};

export default function SignupPage() {
  return <SignupForm />;
}