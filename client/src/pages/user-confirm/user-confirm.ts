import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Toast, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user.provider';
import { SecurityProvider } from '../../providers/security.provider';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'page-user-confirm',
  templateUrl: 'user-confirm.html',
})
export class UserConfirmPage implements OnInit {

  public tokenForm: FormGroup;
  public email: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public securityProvider: SecurityProvider,
    public fb: FormBuilder,
    public userProvider: UserProvider) {
    this.email = navParams.get('email');
  }

  ngOnInit() {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required]]
    });
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  onSubmit() {
    const loading = this.loadingCtrl.create();

    this.userProvider.activateUser(this.email, this.token.value).subscribe(
      (res: any) => {
        this.securityProvider.storeSession(res.session);
        loading.dismiss();
        this.viewCtrl.dismiss();
        this.showMessage('La dirección de correo electrónico ha sido verificada con éxito!');
      },
      (err: HttpErrorResponse) => {
        loading.dismiss();
        if (err.status === 403) {
          this.token.setErrors({ invalidToken: true });
        }
      }
    );

    loading.dismiss();
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

  get token() {
    return this.tokenForm.get('token');
  }

}
