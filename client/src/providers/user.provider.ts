import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterData } from '../pages/register/register-data';
import { environment } from '../environment';

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient) {
  }

  registerUser(registerData: RegisterData) {
    return this.http.post(`${environment.apiUrl}/user`, registerData);
  }

}
