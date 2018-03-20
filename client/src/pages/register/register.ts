import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { validateEmail } from '../../shared/validators/email.validator';
import { validatePasswordMatch } from '../../shared/validators/password-match.validator';
import { UserRegisterData } from './user-register-data';
import { UserProvider } from '../../providers/user.provider';
import { SecurityProvider } from '../../providers/security.provider';
import { HttpErrorResponse } from '@angular/common/http';
import { Session } from '../../shared/models/session.model';
import { User } from '../../shared/models/user.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public registerForm: FormGroup;
  public session: Session;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private fb: FormBuilder,
    private userProvider: UserProvider,
    private securityProvider: SecurityProvider,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.createForm();
    if (this.navParams.get('mode') === 'edit') {
      const loading = this.loadingCtrl.create({
        content: 'Cargando...'
      });

      loading.present().then(() => {
        this.getUser(loading);
      });
    }
  }

  createForm() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, validateEmail]],
      passwordGroup: this.fb.group({
        password: ['', Validators.required],
        passwordConfirm: ['', Validators.required]
      }, { validator: validatePasswordMatch })
    });

    if (this.navParams.get('mode') === 'edit') {
      this.passwordGroup.setValidators([]);
    }
  }

  getUser(loading: Loading) {
    this.securityProvider.getSession().pipe(take(1)).subscribe(
      (session: Session) => {
        this.session = session;
        this.userProvider.getUser(session.userId).subscribe(
          (res: any) => {
            this.patchForm(res.user);
            loading.dismiss();
          }
        )
      }
    )
  }

  patchForm(user: User) {
    this.firstName.patchValue(user.firstName);
    this.lastName.patchValue(user.lastName);
    this.email.patchValue(user.email);
  }

  resetPasswordGroup() {
    this.passwordGroup.reset();
  }

  onRegister() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      const registerData: UserRegisterData = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        email: this.email.value,
        password: this.password.value
      }

      this.userProvider.registerUser(registerData).subscribe(
        (res: any) => {
          this.securityProvider.storeSession(res.session);
          loading.dismiss();
          this.viewCtrl.dismiss();
          this.showMessage('Te has registrado con éxito!');
        },
        (err: HttpErrorResponse) => {
          loading.dismiss();
          if (err.status === 409) {
            this.email.setErrors({ duplicatedEmail: true });
          } else {
            this.viewCtrl.dismiss();
            this.showMessage('Ha ocurrido un error. Por favor, vuelve a intentarlo.');
          }
        }
      );
    });
  }

  onUpdateUserDetails() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      this.userProvider.
        updateUserDetails(this.firstName.value, this.lastName.value, this.email.value)
        .subscribe(
          (res: any) => {
            this.patchForm(res.user);
            loading.dismiss();
            this.showMessage('Los datos personales han sido actualizados con éxito.');
          },
          (error: HttpErrorResponse) => {
            loading.dismiss();
            if (error.status === 409) {
              this.email.setErrors({ duplicatedEmail: true });
            } else {
              this.navCtrl.pop();
              this.showMessage('Ha ocurrido un error. Por favor, vuelve a intentarlo.');
            }
          }
        )
    });
  }

  onUpdatePassword() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present().then(() => {
      this.userProvider.
        updatePassword(this.password.value, this.passwordConfirm.value)
        .subscribe(
          (res: any) => {
            this.resetPasswordGroup();
            loading.dismiss();
            this.showMessage('La contraseña ha sido actualizada con éxito.');
          },
          (error: HttpErrorResponse) => {
            loading.dismiss();
            if (error.status === 422) {
              this.password.setErrors({ oldPasswordDoestNotMatch: true });
            } else {
              this.navCtrl.pop();
              this.showMessage('Ha ocurrido un error. Por favor, vuelve a intentarlo.');
            }
          }
        )
    });
  }

  showMessage(message: string) {
    let toast = this.toastCtrl.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  onCloseModal() {
    this.viewCtrl.dismiss();
  }

  get firstName(): AbstractControl {
    return this.registerForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return this.registerForm.get('lastName');
  }

  get email(): AbstractControl {
    return this.registerForm.get('email');
  }

  get passwordGroup(): AbstractControl {
    return this.registerForm.get('passwordGroup');
  }

  get password(): AbstractControl {
    return this.registerForm.get('passwordGroup.password');
  }

  get passwordConfirm(): AbstractControl {
    return this.registerForm.get('passwordGroup.passwordConfirm');
  }

}
