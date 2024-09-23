import { Injectable } from '@angular/core';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from './InjectorService';
import { Bank } from '../Models/References/Bank';
import { catchError, Observable, throwError } from 'rxjs';
import { PaginationAPIModel } from '../Models/ApiResult';
import { HttpClient } from '@angular/common/http';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';

@Injectable({
  providedIn: 'root',
})
export class BankService
  implements InjectorService<Bank>, DuplicateValidationInjectorService<Bank>
{
  readonly baseUrl: string = 'https://localhost:5000/';
  toastrService: any;

  constructor(private http: HttpClient) {}
  isDuplicate(code: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.DOES_BANK_EXIST +
        code
    );
  }

  getEntries(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<Bank>> {
    return this.http
      .get<PaginationAPIModel<Bank>>(
        this.baseUrl +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.GET_BY_PAGINATION,
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

  updateEntry(entry: Bank): Observable<any> {
    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.PUT,
        entry,
        {
          params: { bankCode: entry.bankCode },
        }
      )
      .pipe(
        catchError((error: any) => {
          if (error?.status == 401) {
            console.log('Error : ', error.status + ' : ' + error);
          }
          if (error?.status == 403) {
            console.error(
              `Backend returned code ${error.status}, body was: `,
              error.error
            );
          }
          // console.error('Hi Thusith an error occurred:', error);
          // Optionally, re-throw the error or return a default value
          return throwError(() => {
            const error: any = new Error('error occured !');
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }

  addEntry(entry: Bank): Observable<any> {
    return this.http
      .post<Bank>(
        this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.POST,
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
            const error: any = new Error('error occured !');
            error.timestamp = Date.now();
            return error;
          });
        })
      );
  }

  deleteEntry(entry: Bank): Observable<any> {
    return this.http.delete(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.DELETE +
        entry.bankCode
    );
  }
}
