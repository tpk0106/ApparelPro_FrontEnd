import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, filter, throwError } from 'rxjs';

import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { Country } from '../Models/References/Country';
import { PaginationAPIModel } from '../Models/ApiResult';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from './InjectorService';

@Injectable({
  providedIn: 'any',
})
export class CountryService
  implements
    InjectorService<Country>,
    DuplicateValidationInjectorService<Country>
{
  readonly baseUrl: string = 'https://localhost:5000/';
  toastrService: any;

  constructor(private http: HttpClient) {}

  deleteEntry(entry: Country): Observable<any> {
    return this.http.delete(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.DELETE +
        entry.code
    );
    // .subscribe({
    //   next: () => {
    //     this.toastrService.success(`country, deleted  Successfully`);
    //   },
    //   error: (error: any) => {
    //     console.log('ERROR : ', error.error);
    //     if (error.status == 403) {
    //       console.log('Error : ' + error.status);
    //     }
    //   },
    //   complete: () => {
    //     console.log('deletion completed');
    //   },
    // });
  }

  isDuplicate(code: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.DOES_COUNTRY_EXIST +
        code
    );
  }

  // base class methods
  addEntry(entry: Country) {
    return this.http
      .post<Country>(
        this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.POST,
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

  updateEntry(entry: Country): Observable<any> {
    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.PUT,
        entry,
        {
          params: { code: entry.code },
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

  init() {
    console.log('init of  country service ');
  }

  getEntries(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<Country>> {
    return this.http
      .get<PaginationAPIModel<Country>>(
        this.baseUrl +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.GET_BY_PAGINATION,
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

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
