import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ProfilePage } from './profile';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { BusinessApprovalPage } from '../business-approval/business-approval';
import { BusinessRegisterPage } from '../business-register/business-register';
import { Geolocation } from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    ProfilePage,
    LoginPage,
    RegisterPage,
    BusinessApprovalPage,
    BusinessRegisterPage
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
    BusinessRegisterPage
  ]
})
export class ProfilePageModule { }
