import * as yup from "yup";
import { emailField } from "./common";

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
  phone: yup.string().required("휴대폰 번호를 입력해주세요."),

  birth: yup
    .string()
    .matches(/^[0-9]{8}$/, "생년월일은 8자리 숫자여야 합니다.")
    .test("valid-date", "올바른 날짜가 아닙니다.", (value) => {
      if (!value) return false;
      const year = Number(value.slice(0, 4));
      const month = Number(value.slice(4, 6));
      const day = Number(value.slice(6, 8));
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      );
    })
    .required("생년월일을 입력해주세요."),

  zipcode: yup.string().required("우편번호를 입력해주세요."),
  basic_address: yup.string().required("기본 주소를 입력해주세요."),
  detail_address: yup.string().optional(),
});

export type SignupFormValues = yup.InferType<typeof signupSchema>;