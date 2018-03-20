import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment";
import { BusinessRegisterData } from "../pages/business-register/business-register-data";

@Injectable()
export class BusinessProvider {

  constructor(private http: HttpClient) { }

  registerBusiness(registerData: BusinessRegisterData) {
    return this.http.post(`${environment.apiUrl}/businesses`, registerData);
  }

  addImageToBusiness(businessId: string, image: string) {
    return this.http.post(`${environment.apiUrl}/businesses/${businessId}/images`, { image });
  }

  removeImageFromBusiness(businessId: string, imageId: string) {
    return this.http.delete(`${environment.apiUrl}/businesses/${businessId}/images/${imageId}`);
  }

  editBusiness(businessId: string, editData: BusinessRegisterData) {
    return this.http.put(`${environment.apiUrl}/businesses/${businessId}`, editData);
  }

}
