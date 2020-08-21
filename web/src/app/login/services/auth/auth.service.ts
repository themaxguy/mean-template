import { Injectable } from '@angular/core';
import { StoreService } from '@shared/services/store/store.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISignupForm } from '@login/models/signupForm';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private httpOptions;

  constructor(private http: HttpClient, private storeService: StoreService) {
    this.storeService.$httpOptions
      .asObservable()
      .subscribe((opts) => (this.httpOptions = { headers: opts }));
  }

  // todo: change observable type
  login(email: string, password: string): Observable<any> {
    const body = { email: email, password: password };
    return this.http.post(`${this.baseUrl}/login`, body, this.httpOptions);
  }

  // todo: change observable type
  signup(signupForm: ISignupForm): Observable<any> {
    const body = signupForm;
    return this.http.post(`${this.baseUrl}/signup`, body, this.httpOptions);
  }
}
