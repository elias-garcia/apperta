import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { validateEmail } from '../../shared/validators/email.validator';
import { validatePasswordMatch } from '../../shared/validators/password-match.validator';
import { RegisterData } from './register-data';
import { UserProvider } from '../../providers/user.provider';
import { SecurityProvider } from '../../providers/security.provider';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public registerForm: FormGroup;

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
  }

  onSubmitForm() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...'
    });

    loading.present();

    const registerData: RegisterData = {
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
