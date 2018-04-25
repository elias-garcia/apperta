import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, LoadingController, Events, Toast } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginData } from './login-data';
import { UserProvider } from '../../providers/user.provider';
import { SecurityProvider } from '../../providers/security.provider';
import { HttpErrorResponse } from '@angular/common/http';
import { validateEmail } from '../../shared/validators/email.validator';
import { PasswordResetPage } from '../password-reset/password-reset';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private fb: FormBuilder,
    private userProvider: UserProvider,
    private securityProvider: SecurityProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, validateEmail]],
      password: ['', Validators.required]
    })
    this.onPasswordResetSuccessEvent();
  }

  onPasswordResetSuccessEvent() {
    this.events.subscribe('password-reset:success', () => this.viewCtrl.dismiss());
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  onSubmitForm() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(
      () => {
        const loginData: LoginData = {
          email: this.email.value,
          password: this.password.value
        }

        this.userProvider.login(loginData).subscribe(
          (res: any) => {
            console.log(res);
            this.securityProvider.storeSession(res.session);
            loading.dismiss();
            this.navCtrl.pop();
            this.showMessage(`Bienvenido ${res.session.firstName}!`);
          }, (err: HttpErrorResponse) => {
            loading.dismiss();
            if (err.status === 403) {
              if (err.error.message.includes('password')) {
                this.password.setErrors({ 'passwordDoesNotMatch': true });
              }
              if (err.error.message.includes('email')) {
                this.email.setErrors({ 'emailDoesNotExist': true });
              }
            } else {
              this.viewCtrl.dismiss();
              this.showMessage('Ha ocurrido un error. Por favor, vuelve a intentarlo.');
            }
          }
        )
      }
    );
  }

  onOpenResetPasswordPage() {
    this.navCtrl.push(PasswordResetPage);
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

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

}
