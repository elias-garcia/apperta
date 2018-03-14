import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { BusinessApprovalPage } from '../business-approval/business-approval';
import { BusinessRegisterPage } from '../business-register/business-register';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) { }

  onShowLoginModal() {
    const modal = this.modalCtrl.create(LoginPage);

    modal.present();
  }

  onShowRegisterModal() {
    const modal = this.modalCtrl.create(RegisterPage);

    modal.present();
  }

  onOpenEditProfilePage() {
    this.navCtrl.push(RegisterPage);
  }

  onOpenBusinessApprovalPage() {
    this.navCtrl.push(BusinessApprovalPage);
  }

  onOpenBusinessRegisterPage() {
    this.navCtrl.push(BusinessRegisterPage);
  }

}
