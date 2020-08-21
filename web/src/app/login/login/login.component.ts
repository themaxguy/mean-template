import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  clicked = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;
    if (this.loginForm.invalid) return;

    this.authService.login(email, password).subscribe(
      (res: any) => {
        // todo: set jwt and route to home page
        console.log('logged in');
      },
      err => console.error('error logging in user:', err)
    );
  }

}
