import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";

import { AverageRatingComponent } from "./components/average-rating/average-rating.component";
import { SingleImagePage } from "./pages/single-image/single-image";

@NgModule({
  declarations: [
    AverageRatingComponent,
    SingleImagePage,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    AverageRatingComponent,
    SingleImagePage
  ],
  entryComponents: [
    SingleImagePage
  ]
})
export class SharedModule { }
