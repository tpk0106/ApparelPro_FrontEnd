import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../misc/error-handler.service';
import { CurrencyExchange } from '../Models/References/CurrencyExchange';
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
export class CurrencyExchangeService
  implements
    InjectorService<CurrencyExchange>,
    DuplicateValidationInjectorService<CurrencyExchange>
{
  readonly baseUrl: string = 'https://localhost:5000/';

  currencyExchanges: CurrencyExchange[] = [];

  constructor(
    private http: HttpClient,
    private ToastrService: ToastrService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  deleteEntry(entry: CurrencyExchange): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  isDuplicate(code: string): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  addEntry(entry: CurrencyExchange): Observable<any> {
    return this.http
      .post<CurrencyExchange>(
        this.baseUrl +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY_EXCHANGE.POST,
        entry
      )
      .pipe(
        catchError((error: any) => {
          console.error('Hi Thusith an error occurred:', error);
          // Optionally, re-throw the error or return a default value
          return throwError(() => {
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }
  updateEntry(entry: CurrencyExchange): Observable<any> {
    return this.http
      .put(
        this.baseUrl +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY_EXCHANGE.PUT,
        entry,
        {
          params: { baseCurrency: entry.baseCurrency },
        }
      )
      .pipe(
        catchError((err: any) => {
          return throwError(() => {
            return err;
          });
        })
      );
  }

  getEntries(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<CurrencyExchange>> {
    return this.http
      .get<PaginationAPIModel<CurrencyExchange>>(
        this.baseUrl +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY_EXCHANGE.GET,
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
          console.error('Hi Thusith an error occurred:', error);
          // Optionally, re-throw the error or return a default value
          return throwError(() => {
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }

  // addCurrencyExchange(currencyExchange: CurrencyExchange) {
  //   return this.http
  //     .post<CurrencyExchange>(
  //       this.baseUrl +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY_EXCHANGE.POST,
  //       currencyExchange
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

  updateCurrencyExchange(
    baseCurrency: string,
    currencyExchange: CurrencyExchange
  ) {
    return this.http
      .put(
        this.baseUrl +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY_EXCHANGE.PUT,
        currencyExchange,
        {
          params: { baseCurrency: baseCurrency },
        }
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
