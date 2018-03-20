import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { BusinessProvider } from '../../providers/business.provider';
import { BusinessStatus } from '../../shared/models/business-status.enum';
import { Business } from '../../shared/models/business.model';
import { BussinessHomePage } from '../bussiness-home/bussiness-home';

@Component({
  selector: 'page-business-approval',
  templateUrl: 'business-approval.html',
})
export class BusinessApprovalPage {

  public businesses: Business[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private businessProvider: BusinessProvider
  ) { }

  ionViewWillEnter() {
    this.getBusinesses();
  }

  getBusinesses() {
    const loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    loading.present().then(() => {
      this.businessProvider.getBusinesses(BusinessStatus.PENDING).subscribe(
        (res: any) => {
          this.businesses = res.businesses;
          loading.dismiss();
        }
      );
    })
  }

  onOpenBusinessPage(business: Business) {
    this.navCtrl.push(BussinessHomePage, { mode: 'edit', business });
  }

}
