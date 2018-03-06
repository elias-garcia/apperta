import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";

import { SharedModule } from "../../shared/shared.module";
import { HomePage } from "./home";
import { BussinessHomePage } from "../bussiness-home/bussiness-home";
import { GalleryPage } from "../gallery/gallery";
import { MapsPage } from "../maps/maps";

@NgModule({
  declarations: [
    HomePage,
    BussinessHomePage,
    GalleryPage,
    MapsPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    SharedModule,
  ],
  entryComponents: [
    HomePage,
    BussinessHomePage,
    GalleryPage,
    MapsPage
  ]
})
export class HomePageModule { }
