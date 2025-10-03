import * as Yup from "yup";

/* For User Login */
export const LoginValidator = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoginRequestModel
  extends Yup.InferType<typeof LoginValidator> {}

/* For User Register */
export const RegisterValidator = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  confirm_password: Yup.string()
    .required("Confirm new password is required")
    .oneOf([Yup.ref("password")], "Passwords mismatch"),
});
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RegisterRequestModel
  extends Yup.InferType<typeof RegisterValidator> {}

export const CreateEditBlogCategoryValidator = Yup.object().shape({
  category_id: Yup.string().optional(),
  title: Yup.string().required(),
});
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateEditBlogCategoryRequestModel
  extends Yup.InferType<typeof CreateEditBlogCategoryValidator> {}

export const CreateEditBlogArticleValidator = Yup.object().shape({
  articleId: Yup.string().optional(),
  categoryId: Yup.string().uuid().required(),
  title: Yup.string().required(),
  content: Yup.string().required(),
  userId: Yup.string().uuid().required(),
});
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateEditBlogArticleRequestModel
  extends Yup.InferType<typeof CreateEditBlogArticleValidator> {}
