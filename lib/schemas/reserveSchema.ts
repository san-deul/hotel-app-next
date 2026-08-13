import * as yup from "yup";
import { emailField } from "./common";

export const reserveSchema = yup.object({
  name: yup
    .string()
    .matches(/^[가-힣]+$/, "성명은 한글로 입력해주세요.")
    .required("성명을 입력해주세요."),

  phone: yup
    .string()
    .matches(/^01[0-9]-\d{3,4}-\d{4}$/, "올바른 휴대폰 번호 형식이 아닙니다.")
    .required("휴대폰 번호를 입력해주세요."),

  email: emailField,

  cardNo: yup
    .string()
    .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "카드번호 형식이 올바르지 않습니다.")
    .required("카드번호를 입력해주세요."),

  cardExpYear: yup
    .string()
    .matches(/^\d{4}$/, "연도 4자리를 입력해주세요.")
    .required("유효기간(년)을 입력해주세요."),

  cardExpMonth: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])$/, "월은 01~12 사이로 입력해주세요.")
    .required("유효기간(월)을 입력해주세요."),


  cardAuthBirth: yup
    .string()
    .matches(/^\d{6}$/, "생년월일 6자리를 입력해주세요.")
    .required("생년월일을 입력해주세요."),

  agree: yup
    .boolean()
    .oneOf([true], "개인정보 수집 및 이용에 동의해주세요.")
    .required(),
});

export type ReserveFormValues = yup.InferType<typeof reserveSchema>;