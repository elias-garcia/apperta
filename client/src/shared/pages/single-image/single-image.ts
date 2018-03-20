import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-single-image',
  templateUrl: 'single-image.html',
})
export class SingleImagePage {

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) { }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

}
