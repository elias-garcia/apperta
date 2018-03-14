import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateEmail(control: AbstractControl): ValidationErrors | null {
  // tslint:disable-next-line:max-line-length
  const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!control.value) {
    return null;
  }

  return EMAIL_REGEXP.test(control.value) ? null : { email: true };
}
