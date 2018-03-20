import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { BusinessApprovalPage } from '../business-approval/business-approval';
import { BusinessRegisterPage } from '../business-register/business-register';
import { SecurityProvider } from '../../providers/security.provider';
import { Session } from '../../shared/models/session.model';
import { Role } from '../../shared/models/role.enum';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public Role = Role;
  public session: Session;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private securityProvider: SecurityProvider
  ) { }

  ionViewWillEnter() {
    this.getSession();
  }

  getSession() {
    this.securityProvider.getSession().subscribe(
      (session: Session) => {
        this.session = session;
      }
    )
  }

  onShowLoginModal() {
    const modal = this.modalCtrl.create(LoginPage);

    modal.present();
  }

  onShowRegisterModal() {
    const modal = this.modalCtrl.create(RegisterPage, { mode: 'new' });

    modal.present();
  }

  onOpenEditProfilePage() {
    this.navCtrl.push(RegisterPage, { mode: 'edit' });
  }

  onOpenBusinessApprovalPage() {
    this.navCtrl.push(BusinessApprovalPage);
  }

  onOpenBusinessRegisterPage() {
    this.navCtrl.push(BusinessRegisterPage, { mode: 'new', session: this.session });
  }

  onOpenBusinessEditPage() {
    this.navCtrl.push(BusinessRegisterPage, { mode: 'edit', session: this.session });
  }

  onLogout() {
    this.securityProvider.removeSession();
  }

}
