import { passwordMatchValidator } from './password-match-validator';
import { FormGroup, FormControl } from '@angular/forms';

describe('PasswordMatchValidator', () => {
  function setupForm() {
    return new FormGroup({
      'password': new FormControl(),
      'confirmPassword': new FormControl()
    }, { validators: passwordMatchValidator })
  }

  it('should be valid', () => {
    const form = setupForm()
    expect(form.valid).toBeTruthy()

    form.patchValue({
      password: 'testpassword',
      confirmPassword: 'testpassword'
    })
    expect(form.valid).toBeTruthy()
  })

  it('should be invalid', () => {
    const form = setupForm()
    expect(form.valid).toBeTruthy()

    form.patchValue({
      password: 'testpassword',
      confirmPassword: 'differentpassword'
    })
    expect(form.valid).toBeFalsy()
  })
})
