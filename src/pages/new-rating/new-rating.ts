import { NavController, NavParams } from 'ionic-angular';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'page-new-rating',
  templateUrl: 'new-rating.html',
})
export class NewRatingPage {

  @Output() public submitRating = new EventEmitter<any>();

  public ratingForm: FormGroup;
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
    private fb: FormBuilder
  ) { }

  ionViewDidLoad() {
    this.createForm();
  }

  createForm() {
    this.ratingForm = this.fb.group({
      score: ['', Validators.required]
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

  onSubmit() {
    const ratingData = {
      score: this.score.value
    };

    this.submitRating.emit(ratingData);
  }

  get score(): AbstractControl {
    return this.ratingForm.get('score');
  }

}
