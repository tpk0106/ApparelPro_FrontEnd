import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from '../Models/References/Currency';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { Observable, catchError, throwError } from 'rxjs';
import { PaginationAPIModel } from '../Models/ApiResult';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from './InjectorService';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService
  implements
    InjectorService<Currency>,
    DuplicateValidationInjectorService<Currency>
{
  readonly baseUrl: string = 'https://localhost:5000/';

  constructor(private http: HttpClient) {}

  isDuplicate(code: string, countryCode: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.DOES_CURRENCY_EXIST +
        code +
        '-' +
        countryCode
    );
  }

  addEntry(entry: Currency) {
    return this.http
      .post<Currency>(
        this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.POST,
        entry
      )
      .pipe(
        catchError((error: any) => {
          if (error.status == 401) {
            console.log('Error : ', error.status + ' : ' + error);
          }
          if (error.status == 403) {
            console.error(
              `Backend returned code ${error.status}, body was: `,
              error.error
            );
          }
          console.error('Hi Thusith an error occurred:', error);
          // Optionally, re-throw the error or return a default value
          return throwError(() => {
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }

  updateEntry(entry: Currency): Observable<any> {
    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.PUT,
        entry,
        {
          params: { code: entry.code },
        }
      )
      .pipe(
        catchError((error: any) => {
          if (error.status == 401) {
            console.log('Error : ', error.status + ' : ' + error);
          }
          if (error.status == 403) {
            console.error(
              `Backend returned code ${error.status}, body was: `,
              error.error
            );
          }
          console.error('Hi Thusith an error occurred:', error);
          // Optionally, re-throw the error or return a default value
          return throwError(() => {
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }

  deleteEntry(entry: Currency): Observable<any> {
    return this.http.delete(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.DELETE +
        entry.code
    );
  }

  getEntries(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<Currency>> {
    return this.http
      .get<PaginationAPIModel<Currency>>(
        this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.GET,
        {
          params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortColumn: sortColumn,
            sortOrder: sortOrder,
            filterColumn: filterColumn,
            filterQuery: filterQuery,
          },
        }
      )
      .pipe(
        catchError((error: any) => {
          // console.log(error);

          if (error.status == 401) {
            //this.loggedInUser = err.error;
            console.log('Error : ', error.status + ' : ' + error);
          }
          if (error.status == 403) {
            console.error(
              `Backend returned code ${error.status}, body was: `,
              error.error
            );
          }
          console.error('Hi Thusith an error occurred:', error);
          // Optionally, re-throw the error or return a default value
          return throwError(() => {
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }

  // getCurrencies(
  //   pageNumber: number,
  //   pageSize: number,
  //   sortColumn: string,
  //   sortOrder: string,
  //   filterColumn: string,
  //   filterQuery: string
  // ): Observable<PaginationAPIModel<Currency>> {
  //   return this.http
  //     .get<PaginationAPIModel<Currency>>(
  //       this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.GET,
  //       {
  //         params: {
  //           pageNumber: pageNumber,
  //           pageSize: pageSize,
  //           sortColumn: sortColumn,
  //           sortOrder: sortOrder,
  //           filterColumn: filterColumn,
  //           filterQuery: filterQuery,
  //         },
  //       }
  //     )
  //     .pipe(
  //       catchError((error: any) => {
  //         console.error('Hi Thusith an error occurred:', error);
  //         // Optionally, re-throw the error or return a default value
  //         return throwError(() => {
  //           error.timestamp = Date.now();
  //           return error;
  //         });
  //       })
  //     );
  // }

  // addCurrency(currency: Currency) {
  //   console.log('ADD CURR', currency);

  //   return this.http
  //     .post<Currency>(
  //       this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.POST,
  //       currency
  //     )
  //     .pipe(
  //       catchError((err: any) => {
  //         return throwError(() => {
  //           return err;
  //         });
  //       })
  //     );
  //   // .subscribe({
  //   //   next: (currency) => this.processSubscription(currency),
  //   //   error: (err) => {
  //   //     const error: string = err.error;
  //   //     // this.subscribedMessage.next(error);
  //   //     this.errorHandlerService.handleError(err);
  //   //     // this.isSubscribed.next(true);
  //   //   },
  //   //   complete: () => {
  //   //     this.toastrService.success(
  //   //       `Currency added Successfully, ${currency.code}`
  //   //     );
  //   //   },
  //   // });
  // }

  // UpdateCurrency(code: string, currency: Currency) {
  //   return this.http
  //     .patch(
  //       APPARELPRO_ENDPOINTS.URLS.BASEURL +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.PUT,
  //       currency,
  //       {
  //         params: { code: code },
  //       }
  //     )
  //     .pipe(
  //       catchError((err: any) => {
  //         return throwError(() => {
  //           return err;
  //         });
  //       })
  //     );
  // }

  // processSubscription(currency: Currency) {
  //   console.log('return curr ', currency);

  //   // this.toastrService.success(
  //   //   `currency added  Successfully, ${(currency.code, currency.name)}`
  //   // );
  //   // this.isSubscribed.next(true);
  //   console.log('successful ');
  // }

  // deleteCurrency(code: string) {
  //   return this.http
  //     .delete(
  //       this.baseUrl +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.DELETE +
  //         code
  //     )
  //     .pipe(
  //       catchError((err: any) => {
  //         return throwError(() => {
  //           return err;
  //         });
  //       })
  //     );
  // }

  // getCurrencyByCode(code: string) {
  //   return this.http
  //     .get<Currency>(
  //       this.baseUrl +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY.GETBY_CODE +
  //         code
  //     )
  //     .pipe(
  //       catchError((err: any) => {
  //         return throwError(() => {
  //           return err;
  //         });
  //       })
  //     );
  // }
}
