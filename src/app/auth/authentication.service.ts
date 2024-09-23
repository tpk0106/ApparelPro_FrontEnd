import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { loginRequest } from '../Models/login/loginRequest';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { loginResponse } from '../Models/login/loginResponse';

import { TokenAPIModel } from './tokenAPIModel';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  tokenKey: string = 'token';
  refreshTokenKey: string = 'refreshToken';

  authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  token = new BehaviorSubject<string | null>(null);
  token$ = this.token.asObservable();
  httpheader: { headers: any };

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    this.http = new HttpClient(httpBackend);
    this.httpheader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  init(): void {
    if (this.isAuthenticated()) this.setAuthStatus(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() != null;
  }

  login(login: loginRequest): Observable<loginResponse> {
    return this.http
      .post<loginResponse>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REGISTRATION.USER.LOGIN,
        login
      )
      .pipe(
        tap((loginResponse) => {
          if (loginResponse.success && loginResponse.token) {
            localStorage.setItem(this.tokenKey, loginResponse.token);
            localStorage.setItem(
              this.refreshTokenKey,
              loginResponse.refreshToken
            );

            this.token.next(loginResponse.token);
            this.setAuthStatus(loginResponse.success);
          }
        })
      );
  }

  refreshToken(tokenAPIModel: TokenAPIModel): Observable<TokenAPIModel> {
    return this.http
      .post<TokenAPIModel>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL + APPARELPRO_ENDPOINTS.TOKEN.REFRESH,
        tokenAPIModel
      )
      .pipe(
        tap((responseTokenAPIModel) => {
          if (responseTokenAPIModel) {
            localStorage.setItem(this.tokenKey, responseTokenAPIModel.token);
            localStorage.setItem(
              this.refreshTokenKey,
              responseTokenAPIModel.refreshToken
            );
            this.token.next(responseTokenAPIModel.token);
          }
        })
      );
  }

  setAuthStatus(isAuthenticated: boolean) {
    this.authStatus.next(isAuthenticated);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.token.next(null);
    this.setAuthStatus(false);
    console.log('logged out');
  }
}
