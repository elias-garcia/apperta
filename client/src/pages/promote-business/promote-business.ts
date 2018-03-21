import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { BusinessProvider } from '../../providers/business.provider';
import { Business } from '../../shared/models/business.model';
import { environment } from '../../environment';

declare var Stripe: any;

@Component({
  selector: 'page-promote-business',
  templateUrl: 'promote-business.html',
})
export class PromoteBusinessPage {

  private stripe = Stripe(environment.stripe.pk);
  public business: Business;
  public card: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private businessProvider: BusinessProvider
  ) { }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    loading.present().then(() => {
      this.initStripe();
      this.getBusiness(this.navParams.get('session').business, loading);
    });
  }

  getBusiness(businessId: string, loading: Loading) {
    this.businessProvider.getBusiness(businessId).subscribe(
      (res: any) => {
        this.business = res.business;
        loading.dismiss();
      }
    )
  }

  initStripe() {
    const elements = this.stripe.elements({ locale: 'es' });
    const style = {
      base: {
        lineHeight: '32px',
        fontFamily: '"Helvetica Neue"',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
    };

    this.card = elements.create('card', { style });
    this.card.mount('#card-element');
    this.card.addEventListener('change', function (event) {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  onSubmitStripeForm() {
    this.stripe.createToken(this.card).then((result) => {
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // Send the token to your server.
        console.log(result.token);
      }
    });
  }

}
