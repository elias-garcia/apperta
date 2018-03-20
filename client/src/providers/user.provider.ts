import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegisterData } from '../pages/register/user-register-data';
import { environment } from '../environment';
import { LoginData } from '../pages/login/login-data';
import { PasswordResetData } from '../pages/password-reset/password-reset-data';

@Injectable()
export class UserProvider {

  constructor(private http: HttpClient) { }

  registerUser(registerData: UserRegisterData) {
    return this.http.post(`${environment.apiUrl}/users`, registerData);
  }

  login(loginData: LoginData) {
    return this.http.post(`${environment.apiUrl}/sessions`, loginData);
  }

  updateUserDetails(firstName: string, lastName: string, email: string) {
    return this.http.put(`${environment.apiUrl}/me`, { firstName, lastName, email });
  }

  updatePassword(oldPassword: string, newPassword: string) {
    return this.http.patch(`${environment.apiUrl}/me`, { oldPassword, newPassword });
  }

  getUser(userId: string) {
    return this.http.get(`${environment.apiUrl}/users/${userId}`);
  }

  sendResetPasswordToken(email: string) {
    return this.http.post(`${environment.apiUrl}/password-reset-tokens`, { email });
  }

  resetPassword(passwordResetData: PasswordResetData) {
    return this.http.put(`${environment.apiUrl}/me/password`, passwordResetData);
  }

}
