import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Basis } from '../Models/References/Basis';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { catchError, Observable, throwError } from 'rxjs';
import { PaginationAPIModel } from '../Models/ApiResult';
import { InjectorService } from './InjectorService';

@Injectable({
  providedIn: 'root',
})
export class BasisService implements InjectorService<Basis> {
  constructor(private http: HttpClient) {}

  deleteEntry(entry: Basis): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  addEntry(entry: Basis): Observable<any> {
    throw new Error('Method not implemented.');
  }

  updateEntry(entry: Basis): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getEntries(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<Basis>> {
    return this.http
      .get<PaginationAPIModel<Basis>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BASIS.GET,
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

  getBasises() {
    return this.http
      .get<Basis[]>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BASIS.GET
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
