import { z } from "zod";
import { emailField, passwordField } from "./common";

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "비밀번호를 입력해주세요."), // 로그인은 형식 검증 불필요, 존재만 확인
});

export type LoginFormValues = z.infer<typeof loginSchema>;