import {
  HttpBackend,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenAPIModel } from '../auth/tokenAPIModel';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class InterceptAuthentication implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private httpbackend: HttpBackend,
    private toastrService: ToastrService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    //const tok = this.authService.login()
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    // https://stackoverflow.com/questions/69720067/angular-interceptor-executed-before-http-request
    //send the request to the next handler
    return next.handle(req).pipe(
      catchError((error) => {
        // Perform logout on 401 – Unauthorized HTTP response errors
        //if ([401, 403].includes(error.status)) {}
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 //|| error.status == 403) // check for Unauthorized and Forbidden (user nt allowed to execute this method)
        ) {
          console.log('token expired');
          this.toastrService.error('token expired.Pease login');
          //this.toastrService.error(error.error);
          var tokenAPIModel = <TokenAPIModel>{};
          tokenAPIModel.token = this.authService.getToken()!;
          tokenAPIModel.refreshToken = this.authService.getRefreshToken()!;

          this.authService
            .refreshToken(tokenAPIModel!)
            // added to test
            // .pipe(
            //   catchError((error: any) => {
            //     if (error.status == 401) {
            //       // this.toastrService.error(error.error);
            //       console.log('Error : ', error.status + ' : ' + error);
            //     }
            //     if (error.status == 403) {
            //       console.error(
            //         `Backend returned code ${error.status}, body was: `,
            //         error.error
            //       );
            //     }

            //     console.error('Hi Thusith an error occurred:', error);
            //     // this.toastrService.error(error.error);
            //     //  Optionally, re-throw the error or return a default value
            //     return throwError(() => {
            //       error.timestamp = Date.now();
            //       return error;
            //     });
            //   })
            // )
            // end of added
            .subscribe(() => {
              this.toastrService.success('token resfreshed successfully');
            });
        }

        return throwError(() => {
          console.log('Thusith interceptor  Error : ', error);
          // this.toastrService.error(error.error);
        });
      })
    );
  }
}
