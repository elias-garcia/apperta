import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environment";
import { BusinessRegisterData } from "../pages/business-register/business-register-data";
import { BusinessStatus } from "../shared/models/business-status.enum"
import { RatingData } from "../pages/new-rating/rating-data";
import { BusinessType } from "../shared/models/business-type.enum";

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

  getBusiness(businessId: string) {
    return this.http.get(`${environment.apiUrl}/businesses/${businessId}`);
  }

  getBusinesses(status?: BusinessStatus, name?: string, type?: BusinessType, avgRating?: number) {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    if (name) {
      params = params.set('name', name);
    }

    if (type) {
      params = params.set('type', type);
    }

    if (avgRating) {
      params = params.set('avgRating', String(avgRating));
    }

    return this.http.get(`${environment.apiUrl}/businesses`, { params });
  }

  changeBusinessStatus(businessId: string, status: BusinessStatus) {
    return this.http.patch(`${environment.apiUrl}/businesses/${businessId}`, { status })
  }

  deleteBusiness(businessId: string) {
    return this.http.delete(`${environment.apiUrl}/businesses/${businessId}`);
  }

  submitRating(businessId: string, ratingData: RatingData) {
    return this.http.post(`${environment.apiUrl}/businesses/${businessId}/ratings`, ratingData);
  }

  getRatings(businessId: string, score?: number) {
    let params = new HttpParams();

    if (score) {
      params = params.set('score', String(score));
    }

    return this.http.get(`${environment.apiUrl}/businesses/${businessId}/ratings`, { params });
  }

  promoteBusiness(token: string, paymentRate: number) {
    return this.http.post(`${environment.apiUrl}/payments`, { token, paymentRate });
  }

}
