import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ProfilePage } from './profile';
import { LoginPage } from '../login/login';

@NgModule({
  declarations: [
    ProfilePage,
    LoginPage
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  entryComponents: [
    ProfilePage,
    LoginPage
  ]
})
export class ProfilePageModule { }
