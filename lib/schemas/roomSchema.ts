import * as yup from "yup";

export const roomSchema = yup.object({
  parentNo: yup.string().required("대분류를 선택해주세요."),
  room_name: yup.string().required("객실명을 입력해주세요."),
  info: yup.string(),
  price: yup
    .number()
    .typeError("가격은 숫자만 입력 가능합니다.")
    .required("가격은 필수입니다."),
  guest_count: yup
    .number()
    .typeError("인원수는 숫자만 입력 가능합니다.")
    .required("인원수는 필수입니다."),
  total_room: yup
    .number()
    .typeError("객실 수는 숫자만 입력 가능합니다.")
    .required("객실 수는 필수입니다."),
});

export type RoomFormValues = yup.InferType<typeof roomSchema>;


export const categorySchema = yup.object({
  room_name: yup.string().required("객실명은 필수입니다."),
});

export type CategoryFormValues = yup.InferType<typeof categorySchema>;


export const roomEditSchema = yup.object({
  room_name: yup.string().required("객실명을 입력해주세요."),
  info: yup.string(),
  price: yup.number().typeError("가격은 숫자만 입력 가능합니다.").required("가격은 필수입니다."),
  guest_count: yup.number().typeError("인원수는 숫자만 입력 가능합니다.").required("인원수는 필수입니다."),
  total_room: yup.number().typeError("객실 수는 숫자만 입력 가능합니다.").required("객실 수는 필수입니다."),
});
export type RoomEditFormValues = yup.InferType<typeof roomEditSchema>;