import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '@login/services/auth/auth.service';

import { ISignupForm } from '@login/models/signupForm';
import { passwordMatchValidator } from '@shared/directives/password-match-validator'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  // samePasswordValidator(): ValidatorFn {
  //   const self = this
  //   return (control: AbstractControl): {[key: string]: any} | null => {
  //     const equal = self.signupForm.get('password') === self.signupForm.get('confirmPassword')
  //     return equal ? null : {mismatch: {value: control.value}}
  //   }
  // }

  ngOnInit(): void { }

  onSubmit(): void {

    const signupForm: ISignupForm = this.signupForm.value;

    if (this.signupForm.invalid) return;

    this.authService.signup(signupForm).subscribe(
      (res: any) => {
        // todo: set jwt and route to home page
        console.log('logged in');
      },
      err => console.error('error logging in user:', err)
    );
  }

}
