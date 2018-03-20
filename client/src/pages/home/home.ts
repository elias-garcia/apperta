import { Component } from '@angular/core';
import { NavController, LoadingController, App } from 'ionic-angular';

import { BussinessHomePage } from '../bussiness-home/bussiness-home';
import { BusinessProvider } from '../../providers/business.provider';
import { Business } from '../../shared/models/business.model';
import { BusinessStatus } from '../../shared/models/business-status.enum';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public businesses: Business[];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public businessProvider: BusinessProvider,
    public app: App,
  ) {
    this.getBusinesses();
  }

  getBusinesses() {
    const loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    loading.present().then(() => {
      this.businessProvider.getBusinesses(BusinessStatus.APPROVED).subscribe(
        (res: any) => {
          this.businesses = res.businesses;
          loading.dismiss();
        }
      );
    });
  }

  onCardClick(business: Business) {
    this.navCtrl.push(BussinessHomePage, { mode: 'view', business });
  }

}
