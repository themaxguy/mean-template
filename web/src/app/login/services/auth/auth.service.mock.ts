import { Injectable } from '@angular/core';
import { ISignupForm } from '@login/models/signupForm';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceMock {

  constructor() { }

  // todo: change observable type
  login(email: string, password: string): Observable<any> {
    // todo: mock response type and jwt/cookie?
    return of({});
  }

  // todo: change observable type
  signup(signupForm: ISignupForm): Observable<any> {
    // todo: mock response type and jwt/cookie?
    return of({});
  }
}
