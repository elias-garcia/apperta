import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RatingData } from './rating-data';
import { Business } from '../../shared/models/business.model';
import { BusinessProvider } from '../../providers/business.provider';

@Component({
  selector: 'page-new-rating',
  templateUrl: 'new-rating.html',
})
export class NewRatingPage {
  public ratingForm: FormGroup;
  public business: Business;
  public ratingStars = [
    { value: 1, hover: false },
    { value: 2, hover: false },
    { value: 3, hover: false },
    { value: 4, hover: false },
    { value: 5, hover: false },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private businessProvider: BusinessProvider
  ) {
    this.createForm();
    this.business = this.navParams.get('business');
  }

  createForm() {
    this.ratingForm = this.fb.group({
      score: ['', Validators.required],
      title: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  changeStars(index: number) {
    this.ratingStars.map(ratingStar => {
      if (ratingStar.value <= index) {
        ratingStar.hover = true;
      } else {
        ratingStar.hover = false;
      }
    });
  }

  onPickRating(value: number) {
    this.changeStars(value);
    this.score.patchValue(value);
  }

  onSubmitRating() {
    const ratingData: RatingData = {
      score: this.score.value,
      title: this.title.value,
      comment: this.comment.value
    };

    this.businessProvider.submitRating(this.business.id, ratingData)
      .subscribe(
        (res: any) => {
          console.log(res);
        }
      )
  }

  get score(): AbstractControl {
    return this.ratingForm.get('score');
  }

  get title(): AbstractControl {
    return this.ratingForm.get('title');
  }

  get comment(): AbstractControl {
    return this.ratingForm.get('comment');
  }

}
