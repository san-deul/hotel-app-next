// lib/schemas/myInfoSchema.ts
import * as yup from "yup";
import { phoneField, birthField } from "./common";

export const myInfoSchema = yup.object({
  name: yup.string().required("이름을 입력해주세요."),
  phone: phoneField,
  birth: birthField,
  zipcode: yup.string().required("우편번호를 입력해주세요."),
  basic_address: yup.string().required("기본 주소를 입력해주세요."),
  detail_address: yup.string().optional(),
});

export type MyInfoFormValues = yup.InferType<typeof myInfoSchema>;