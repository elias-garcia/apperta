import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginData } from './login-data';
import { UserProvider } from '../../providers/user.provider';
import { SecurityProvider } from '../../providers/security.provider';
import { Session } from '../../shared/models/session.model';
import { HttpErrorResponse } from '@angular/common/http';
import { validateEmail } from '../../shared/validators/email.validator';

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
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  onSubmitForm() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present();

    const loginData: LoginData = {
      email: this.email.value,
      password: this.password.value
    }

    this.userProvider.login(loginData).subscribe(
      (res: any) => {
        this.securityProvider.storeSession(res.session);
        loading.dismiss();
        this.viewCtrl.dismiss();
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

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message,
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
