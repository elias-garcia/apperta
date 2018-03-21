import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-all-ratings',
  templateUrl: 'all-ratings.html',
})
export class AllRatingsPage {

  public Array: ArrayConstructor = Array;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

}
