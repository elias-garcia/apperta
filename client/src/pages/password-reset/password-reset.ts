import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { validateEmail } from '../../shared/validators/email.validator';
import { UserProvider } from '../../providers/user.provider';
import { HttpErrorResponse } from '@angular/common/http';
import { validatePasswordMatch } from '../../shared/validators/password-match.validator';
import { SecurityProvider } from '../../providers/security.provider';

@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {

  public sendTokenForm: FormGroup;
  public passwordResetForm: FormGroup;
  public hasTokenBeenSent = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events,
    private fb: FormBuilder,
    private userProvider: UserProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private securityProvider: SecurityProvider
  ) {
    this.sendTokenForm = this.fb.group({
      email: ['', [Validators.required, validateEmail]]
    });

    this.passwordResetForm = this.fb.group({
      token: ['', [Validators.required]],
      email: ['', [Validators.required, validateEmail]],
      passwordGroup: this.fb.group({
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required]
      }, { validator: validatePasswordMatch })
    })
  }

  onSendPasswordResetToken() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      this.userProvider.sendResetPasswordToken(this.email.value).subscribe(
        () => {
          loading.dismiss();
        },
        (error: HttpErrorResponse) => {
          loading.dismiss();
          switch (error.status) {
            case 202:
              const tempEmail = this.email.value;
              this.hasTokenBeenSent = true;
              this.email.patchValue(tempEmail)
              this.showMessage('Código enviado con éxito')
              break;
            case 404:
              this.email.setErrors({ 'emailDoesNotExist': true });
              break
            default:
              this.viewCtrl.dismiss();
              this.showMessage('Ha ocurrido un error. Por favor, vuelve a intentarlo.');
          }
        }
      )
    });
  }

  onPasswordReset() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      const payload = {
        email: this.email.value,
        token: this.token.value,
        newPassword: this.password.value,
        newPasswordConfirm: this.passwordConfirm.value
      };

      this.userProvider.resetPassword(payload).subscribe(
        (res: any) => {
          this.securityProvider.storeSession(res.session);
          loading.dismiss();
          this.showMessage('La contraseña ha sido reestablecida con éxito.');
          this.events.publish('password-reset:success');
          this.navCtrl.pop();
        },
        (err: HttpErrorResponse) => {
          loading.dismiss();
          switch (err.status) {
            case 404:
              this.email.setErrors({ emailDoesNotExist: true });
              break;
            case 422:
              this.token.setErrors({ notValidToken: true });
              break;
            default:
              this.navCtrl.pop();
              this.showMessage('Ha ocurrido un error. Por favor, vuelva a intentarlo.');
          }
        }
      );
    });
  }

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000
    });

    toast.present();
  }

  get email(): AbstractControl {
    if (this.hasTokenBeenSent) {
      return this.passwordResetForm.get('email');
    } else {
      return this.sendTokenForm.get('email');
    }
  }

  get token(): AbstractControl {
    return this.passwordResetForm.get('token');
  }

  get password(): AbstractControl {
    return this.passwordResetForm.get('passwordGroup.password');
  }

  get passwordConfirm(): AbstractControl {
    return this.passwordResetForm.get('passwordGroup.passwordConfirm');
  }

}
