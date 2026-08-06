import * as yup from "yup";
import { emailField } from "./common";

export const loginSchema = yup.object({
  email: emailField,
  password: yup.string().required("비밀번호를 입력해주세요."),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;