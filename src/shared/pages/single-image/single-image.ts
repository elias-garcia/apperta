import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-single-image',
  templateUrl: 'single-image.html',
})
export class SingleImagePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) { }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

}
