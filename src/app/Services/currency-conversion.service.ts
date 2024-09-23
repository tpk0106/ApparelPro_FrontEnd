import { Injectable } from '@angular/core';
import { CurrencyConversion } from '../Models/References/CurrencyConversion';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../misc/error-handler.service';
import { PaginationAPIModel } from '../Models/ApiResult';
import { catchError, Observable, throwError } from 'rxjs';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { InjectorService } from './InjectorService';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConversionService
  implements InjectorService<CurrencyConversion>
{
  currencyConversions: CurrencyConversion[] = [];

  constructor(
    private http: HttpClient,
    //private ToastrService: ToastrService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  deleteEntry(entry: CurrencyConversion): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  addEntry(entry: CurrencyConversion): Observable<any> {
    throw new Error('Method not implemented.');
  }
  updateEntry(entry: CurrencyConversion): Observable<any> {
    throw new Error('Method not implemented.');
  }
  getEntries(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<CurrencyConversion>> {
    return this.http
      .get<PaginationAPIModel<CurrencyConversion>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.CURRENCY_CONVERSION.GET,
        {
          params: {
            pageNumber: pageIndex,
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

  getCurrencyExchanges(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<CurrencyConversion>> {
    return this.http
      .get<PaginationAPIModel<CurrencyConversion>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
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
}
