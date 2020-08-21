import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms'

export const  passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password').value
  const confirmPassword = control.get('confirmPassword').value
  return password !== confirmPassword ? { mismatch: true } : null
}