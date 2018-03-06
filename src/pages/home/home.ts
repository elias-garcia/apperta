import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { BussinessHomePage } from '../bussiness-home/bussiness-home';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController
  ) { }

  onCardClick() {
    this.navCtrl.push(BussinessHomePage);
  }
}
