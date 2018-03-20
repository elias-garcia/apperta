import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SingleImagePage } from '../../shared/pages/single-image/single-image';

@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { }

  onViewImage(image: any) {
    const modal = this.modalCtrl.create(SingleImagePage, { src: image.url })

    modal.present();
  }

}
