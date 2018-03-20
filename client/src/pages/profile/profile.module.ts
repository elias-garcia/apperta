import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ProfilePage } from './profile';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { BusinessApprovalPage } from '../business-approval/business-approval';
import { BusinessRegisterPage } from '../business-register/business-register';
import { Geolocation } from '@ionic-native/geolocation';
import { PasswordResetPage } from '../password-reset/password-reset';

@NgModule({
  declarations: [
    ProfilePage,
    LoginPage,
    RegisterPage,
    BusinessApprovalPage,
    BusinessRegisterPage,
    PasswordResetPage
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  providers: [
    Geolocation
  ],
  entryComponents: [
    ProfilePage,
    LoginPage,
    RegisterPage,
    BusinessApprovalPage,
    BusinessRegisterPage,
    PasswordResetPage
  ]
})
export class ProfilePageModule { }
