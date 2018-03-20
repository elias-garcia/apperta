export interface PasswordResetData {
  email: string;
  token: string;
  newPassword: string;
  newPasswordConfirm: string;
}
