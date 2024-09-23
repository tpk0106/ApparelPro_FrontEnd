import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PaginationAPIModel } from '../Models/ApiResult';
import { Unit } from '../Models/References/Unit';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { HttpClient } from '@angular/common/http';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from './InjectorService';

@Injectable({
  providedIn: 'root',
})
export class UnitService
  implements InjectorService<Unit>, DuplicateValidationInjectorService<Unit>
{
  readonly baseUrl: string = 'https://localhost:5000/';

  constructor(private http: HttpClient) {}

  deleteEntry(entry: Unit): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  isDuplicate(code: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.UNIT.DOES_UNIT_EXIST +
        code
    );
  }

  // base class methods
  addEntry(entry: Unit) {
    return this.http
      .post<Unit>(
        this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.UNIT.POST,
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

  updateEntry(entry: Unit): Observable<any> {
    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.UNIT.PUT,
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

  getEntries(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<Unit>> {
    return this.http
      .get<PaginationAPIModel<Unit>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.UNIT.GET,
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

  doesUnitExist(code: string): Observable<boolean> {
    return this.http
      .get<boolean>(
        this.baseUrl +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.UNIT.DOES_UNIT_EXIST +
          code
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
