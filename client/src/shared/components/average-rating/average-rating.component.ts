import { Component, Input } from "@angular/core";
import { RatingStats } from "../../models/rating-stats.model";

@Component({
  selector: 'average-rating',
  templateUrl: 'average-rating.component.html'
})
export class AverageRatingComponent {

  @Input() ratingStats: RatingStats;

  public isNaN: Function = Number.isNaN;

}
