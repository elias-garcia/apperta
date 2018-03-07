import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { GalleryPage } from '../gallery/gallery';
import { SingleImagePage } from '../../shared/pages/single-image/single-image';
import { MapsPage } from '../maps/maps';
import { NewRatingPage } from '../new-rating/new-rating';

@Component({
  selector: 'page-bussiness-home',
  templateUrl: 'bussiness-home.html',
})
export class BussinessHomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { }

  onViewAllPhotos() {
    this.navCtrl.push(GalleryPage);
  }

  onViewPhoto() {
    const modal = this.modalCtrl.create(SingleImagePage);

    modal.present();
  }

  onOpenMapsPage() {
    this.navCtrl.push(MapsPage);
  }

  onOpenNewRatingPage() {
    this.navCtrl.push(NewRatingPage);
  }

}
