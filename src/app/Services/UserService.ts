import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../misc/error-handler.service';
import User from '../Models/register/User';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class UserService {
  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  readonly baseUrl: string = 'https://localhost:5000/';

  registerUser(User: User) {
    return this.http
      .post<User>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REGISTRATION.USER.POST,
        User
      )
      .pipe(
        catchError((err: any) => {
          return throwError(() => {
            return err;
          });
        })
      );
  }

  updateUser(user: User) {
    this.http
      .patch(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REGISTRATION.USER.PATCH,
        user
      )
      .pipe(
        catchError((err: any) => {
          return throwError(() => {
            return err;
          });
        })
      );
  }

  deleteUser(email: string) {
    return this.http
      .delete(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REGISTRATION.USER.DELETE +
          email
      )
      .pipe(
        catchError((err: any) => {
          return throwError(() => {
            return err;
          });
        })
      );
  }
}
