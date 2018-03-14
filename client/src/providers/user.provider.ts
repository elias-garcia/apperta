import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterData } from '../pages/register/register-data';
import { environment } from '../environment';
import { LoginData } from '../pages/login/login-data';

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient) {
  }

  registerUser(registerData: RegisterData) {
    return this.http.post(`${environment.apiUrl}/users`, registerData);
  }

  login(loginData: LoginData) {
    return this.http.post(`${environment.apiUrl}/sessions`, loginData);
  }

}
