import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rating-dots',
  templateUrl: './rating-dots.component.html'
})
export class RatingDotsComponent implements OnInit {

  @Input() avgRating: number;

  public starsValues = [false, false, false, false, false];

  constructor() {
  }

  ngOnInit() {
    for (let i = 0; i < Math.trunc(this.avgRating); i++) {
      this.starsValues[i] = true;
    }
  }

}
