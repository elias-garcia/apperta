import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ProfilePage } from './profile';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@NgModule({
  declarations: [
    ProfilePage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  entryComponents: [
    ProfilePage,
    LoginPage,
    RegisterPage
  ]
})
export class ProfilePageModule { }
