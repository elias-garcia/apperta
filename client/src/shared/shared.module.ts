import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";

import { AverageRatingComponent } from "./components/average-rating/average-rating.component";
import { SingleImagePage } from "./pages/single-image/single-image";
import { RatingDotsComponent } from "./components/rating-dots/rating-dots.component";

@NgModule({
  declarations: [
    AverageRatingComponent,
    RatingDotsComponent,
    SingleImagePage,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    AverageRatingComponent,
    RatingDotsComponent,
    SingleImagePage
  ],
  entryComponents: [
    SingleImagePage
  ]
})
export class SharedModule { }
