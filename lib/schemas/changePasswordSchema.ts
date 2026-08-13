import * as yup from "yup";
import { passwordField, passwordConfirmField } from "./common";

export const changePasswordSchema = yup.object({
  password: passwordField,
  password_confirm: passwordConfirmField,
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;