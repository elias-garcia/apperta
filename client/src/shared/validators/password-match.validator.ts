import { FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';

export function validatePasswordMatch(group: FormGroup): ValidationErrors | null {
  const password: AbstractControl = group.get('password');
  const passwordConfirm: AbstractControl = group.get('passwordConfirm');

  if (!password.value || !passwordConfirm.value) {
    return null;
  }

  if (password.value !== passwordConfirm.value) {
    return { passwordMatch: true };
  }

  return null;
}
