import * as yup from "yup";
import { phoneField, birthField } from "./common";

export const employeeSchema = yup.object({
  name: yup.string().required("이름을 입력해주세요."),
  phone: phoneField,
  birth: birthField,
  email: yup.string().required("이메일은 필수입니다"),
});

export type EmployeeFormValues = yup.InferType<typeof employeeSchema>;