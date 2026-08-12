import * as yup from "yup";
import { emailField, phoneField, birthField } from "./common";

export const signupSchema = yup.object({
  email: emailField,

  password: yup
    .string()
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
    .required("비밀번호를 입력해주세요."),

  password_confirm: yup
    .string()
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인을 입력해주세요."),

  name: yup.string().required("이름을 입력해주세요."),
  phone: phoneField,
  birth: birthField,

  zipcode: yup.string().required("우편번호를 입력해주세요."),
  basic_address: yup.string().required("기본 주소를 입력해주세요."),
  detail_address: yup.string().optional(),
});

export type SignupFormValues = yup.InferType<typeof signupSchema>;