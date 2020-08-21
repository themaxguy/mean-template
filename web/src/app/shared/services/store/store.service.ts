import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  $httpOptions: BehaviorSubject<HttpHeaders>;

  constructor() {
    this.$httpOptions = new BehaviorSubject<HttpHeaders> (
      new HttpHeaders({
        'Content-Type': 'application/json'
      })
    );
  }

  getHttpOptions() {
    return this.$httpOptions;
  }

  setHttpOptions(opts: HttpHeaders) {
    this.$httpOptions.next(opts);
  }

  setToken(token: string) {
    this.$httpOptions.next(
      new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token
      })
    );
  }
}
