import { Component, Input } from "@angular/core";

@Component({
  selector: 'average-rating',
  templateUrl: 'average-rating.component.html'
})
export class AverageRatingComponent {

  @Input() public totalRatings = 32;
  @Input() public scoreStats = [
    {
      score: 1,
      count: 5
    },
    {
      score: 2,
      count: 18
    },
    {
      score: 3,
      count: 8
    },
    {
      score: 4,
      count: 0
    },
    {
      score: 5,
      count: 1
    }
  ]

}
