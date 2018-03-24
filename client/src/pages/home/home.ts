import { Component } from '@angular/core';
import { NavController, LoadingController, Refresher, ModalController, Loading } from 'ionic-angular';

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
  public term: string;
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
    ).subscribe((term: string) => {
      this.term = term;
      this.getBusinessesByParams();
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

  getBusinessesByParams(loader?: Refresher | Loading) {
    this.businessProvider.getBusinesses(
      BusinessStatus.APPROVED,
      this.term,
      this.filters.type,
      this.filters.avgRating
    ).subscribe(
      (res: any) => {
        this.businesses = res.businesses;
        if (loader) {
          if (loader instanceof Refresher) {
            loader.complete();
          } else {
            loader.dismiss();
          }
        }
      }
    );
  }

  onShowFiltersModal() {
    const modal = this.modalCtrl.create(FiltersPage, { filters: this.filters });

    modal.onDidDismiss((data: any) => this.filterBusinesses(data));
    modal.present();
  }

  filterBusinesses(filters: any) {
    if (filters) {
      const loading = this.loadingCtrl.create({
        content: 'Cargando...'
      });

      loading.present().then(() => {
        this.filters = filters;
        this.getBusinessesByParams(loading);
      });
    }
  }

  onCardClick(business: Business) {
    this.navCtrl.push(BussinessHomePage, { mode: 'view', business });
  }

}
