import { Injectable } from '@angular/core';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from './InjectorService';
import { Address } from '../Models/References/Address';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { PaginationAPIModel } from '../Models/ApiResult';

@Injectable({
  providedIn: 'root',
})
export class AddressService
  implements
    InjectorService<Address>,
    DuplicateValidationInjectorService<Address>
{
  readonly baseUrl: string = 'https://localhost:5000/';

  constructor(private http: HttpClient) {}

  deleteEntry(entry: Address): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  isDuplicate(addressId: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.GET_BY_ADDRESS_ID +
        addressId
    );
  }

  // base class methods
  addEntry(entry: Address) {
    return this.http
      .post<Address>(
        this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.POST,
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

  updateEntry(entry: Address): Observable<any> {
    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.PUT,
        entry,
        {
          params: { id: entry.id, addressId: entry.addressId },
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
  ): Observable<PaginationAPIModel<Address>> {
    return this.http
      .get<PaginationAPIModel<Address>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.GET_BY_PAGINATION,
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
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.DOES_BANK_EXIST +
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
