import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, Toast, ToastController } from 'ionic-angular';
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
  public isFormButtonDisabled = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private businessProvider: BusinessProvider
  ) { }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({
      content: 'Cargando...'
    });

    loading.present().then(() => {
      this.getBusiness(this.navParams.get('session').business, loading);
    });
  }

  getBusiness(businessId: string, loading: Loading) {
    this.businessProvider.getBusiness(businessId).subscribe(
      (res: any) => {
        this.business = res.business;
        if (!this.business.isPromoted) {
          this.initStripe();
        }
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
    this.card.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-errors');

      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  onSubmitStripeForm() {
    this.isFormButtonDisabled = true;

    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      this.stripe.createToken(this.card).then((result) => {
        if (result.error) {
          const errorElement = document.getElementById('card-errors');

          errorElement.textContent = result.error.message;
          loading.dismiss();
        } else {
          this.promoteBusiness(result.token.id, loading);
        }
      });
    });
  }

  promoteBusiness(token: string, loading: Loading) {
    this.businessProvider.promoteBusiness(token).subscribe(
      (res: any) => {
        loading.dismiss();
        this.navCtrl.pop();
        this.showMessage('El pago ha sido realizado con éxito.');
      },
      (error: any) => {
        loading.dismiss();
      }
    );
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

}
