import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";

import { SharedModule } from "../../shared/shared.module";
import { HomePage } from "./home";
import { BussinessHomePage } from "../bussiness-home/bussiness-home";
import { GalleryPage } from "../gallery/gallery";
import { MapsPage } from "../maps/maps";
import { NewRatingPage } from "../new-rating/new-rating";

@NgModule({
  declarations: [
    HomePage,
    BussinessHomePage,
    GalleryPage,
    MapsPage,
    NewRatingPage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    SharedModule,
  ],
  entryComponents: [
    HomePage,
    BussinessHomePage,
    GalleryPage,
    MapsPage,
    NewRatingPage
  ]
})
export class HomePageModule { }
