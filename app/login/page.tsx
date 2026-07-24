import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | SD HOTEL",
  description: "SD HOTEL & Suites 로그인 페이지입니다.",
};

export default function LoginPage() {
  return <LoginForm />;
}