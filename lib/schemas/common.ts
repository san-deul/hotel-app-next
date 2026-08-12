import * as yup from "yup";

export const emailField = yup
  .string()
  .email("올바른 이메일 형식이 아닙니다.")
  .required("이메일을 입력해주세요.");

export const phoneField = yup.string().required("휴대폰 번호를 입력해주세요.");

export const birthField = yup
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
  .required("생년월일을 입력해주세요.");