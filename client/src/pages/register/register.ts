import { Component, ViewChild, Renderer2 } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Platform } from 'ionic-angular';
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

  @ViewChild('emailInput') emailInput: any;

  public registerForm: FormGroup;
  public isAndroid: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private fb: FormBuilder,
    private userProvider: UserProvider,
    private securityProvider: SecurityProvider,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    private renderer: Renderer2
  ) {
    this.createForm();
    if (this.platform.is('android')) {
      this.isAndroid = true;
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
  }

  onSubmitForm() {
    const loading = this.loadingCtrl.create({
      content: 'Por favor, espere...',
      dismissOnPageChange: true
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
        console.log(res);
        this.securityProvider.storeSession(res.session);
        this.navCtrl.pop();
      },
      (err: HttpErrorResponse) => {
        loading.dismiss();
        if (err.status === 409) {
          this.email.setErrors({ duplicatedEmail: true });
          this.renderer.addClass(this.emailInput._elementRef.nativeElement, 'ng-invalid');
        }
      }
    );
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
