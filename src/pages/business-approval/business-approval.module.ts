import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessApprovalPage } from './business-approval';

@NgModule({
  declarations: [
    BusinessApprovalPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessApprovalPage),
  ],
})
export class BusinessApprovalPageModule {}
