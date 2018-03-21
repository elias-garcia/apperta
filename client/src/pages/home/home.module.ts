import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";

import { SharedModule } from "../../shared/shared.module";
import { HomePage } from "./home";
import { BussinessHomePage } from "../bussiness-home/bussiness-home";
import { GalleryPage } from "../gallery/gallery";
import { MapsPage } from "../maps/maps";
import { NewRatingPage } from "../new-rating/new-rating";
import { AllRatingsPage } from "../all-ratings/all-ratings";

@NgModule({
  declarations: [
    HomePage,
    BussinessHomePage,
    GalleryPage,
    MapsPage,
    NewRatingPage,
    AllRatingsPage
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
    NewRatingPage,
    AllRatingsPage
  ]
})
export class HomePageModule { }
