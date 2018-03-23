import { Component } from '@angular/core';
import { NavController, LoadingController, Refresher, ModalController } from 'ionic-angular';

import { BussinessHomePage } from '../bussiness-home/bussiness-home';
import { BusinessProvider } from '../../providers/business.provider';
import { Business } from '../../shared/models/business.model';
import { BusinessStatus } from '../../shared/models/business-status.enum';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators';
import { FiltersPage } from '../filters/filters';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public businesses: Business[];
  public term$ = new Subject<string>();
  public filters: any = { type: '', avgRating: '' };

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private businessProvider: BusinessProvider
  ) {
    this.getBusinesses();
    this.listenToSearchInput();
  }

  listenToSearchInput() {
    this.term$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((name: string) => {
      this.getBusinessesByName(name);
    })
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

  getBusinessesByName(name: string) {
    this.businessProvider.getBusinesses(BusinessStatus.APPROVED, name).subscribe(
      (res: any) => {
        this.businesses = res.businesses;
      }
    );
  }

  refreshBusinesses(refresher: Refresher) {
    this.businessProvider.getBusinesses(BusinessStatus.APPROVED).subscribe(
      (res: any) => {
        this.businesses = res.businesses;
        refresher.complete();
      }
    );
  }

  onShowFiltersModal() {
    const modal = this.modalCtrl.create(FiltersPage, { filters: this.filters });

    modal.onDidDismiss((data: any) => this.filterBusinesses(data));
    modal.present();
  }

  filterBusinesses(filters: any) {
    this.filters = filters;
    console.log(filters);
  }

  onCardClick(business: Business) {
    this.navCtrl.push(BussinessHomePage, { mode: 'view', business });
  }

}
