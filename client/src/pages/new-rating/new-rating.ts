import { NavController, NavParams, Loading, LoadingController, Toast, ToastController } from 'ionic-angular';
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
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
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
    const loading: Loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      const ratingData: RatingData = {
        score: this.score.value,
        title: this.title.value,
        comment: this.comment.value
      };

      this.businessProvider.submitRating(this.business.id, ratingData)
        .subscribe(
          (res: any) => {
            loading.dismiss();
            this.showMessage('La opinión ha sido enviada con éxito.')
            this.navCtrl.pop();
          },
          (err: any) => {
            if (err.status !== 401) {
              loading.dismiss();
              this.showMessage('Ha ocurrido un error. Por favor, vuelve a intentarlo.')
            }
          }
        )
    });
  }

  showMessage(message: string) {
    const toast: Toast = this.toastCtrl.create({
      message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 3000
    });

    toast.present();
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
