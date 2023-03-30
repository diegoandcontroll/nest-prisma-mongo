export interface Iforgot {
  email: string;
}
export interface IResetPassword {
  token: string;
  password: string;
  confirmPassword: string;
}
