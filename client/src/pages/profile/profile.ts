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
  ) {
    this.securityProvider.getSession().subscribe(
      (session: Session) => {
        console.log(session);
        this.session = session;
      }
    )
  }

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

  onLogout() {
    this.securityProvider.removeSession();
  }

}
