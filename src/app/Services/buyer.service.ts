import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Currency } from '../Models/References/Currency';
import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { Observable, catchError, throwError } from 'rxjs';
import { Country } from '../Models/References/Country';
import { ApparelProWebAPIConfig } from '../misc/ApparelProWebAPIConfig';
import { Buyer } from '../Models/References/Buyer';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from './InjectorService';
import { PaginationAPIModel } from '../Models/ApiResult';

@Injectable({
  providedIn: 'any',
})
@Injectable({
  providedIn: 'root',
})
export class BuyerService
  implements InjectorService<Buyer>, DuplicateValidationInjectorService<Buyer>
{
  constructor(private http: HttpClient) {}

  deleteEntry(entry: Buyer): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  isDuplicate(code: string): Observable<boolean> {
    return this.http.get<boolean>(
      APPARELPRO_ENDPOINTS.URLS.BASEURL +
        APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.GET_BY_PAGINATION +
        code
    );
  }

  // base class methods
  addEntry(entry: Buyer) {
    return this.http
      .post<Buyer>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.POST,
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

  updateEntry(entry: Buyer): Observable<any> {
    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.PUT,
        entry,
        {
          params: { code: entry.buyerCode },
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
  ): Observable<PaginationAPIModel<Buyer>> {
    return this.http
      .get<PaginationAPIModel<Buyer>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.GET_BY_PAGINATION,
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
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.GET_BY_PAGINATION +
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

  // ApparelProWebAPIConfig!: ApparelProWebAPIConfig;

  // getBuyers() {
  //   return this.http
  //     .get<Buyer[]>(
  //       APPARELPRO_ENDPOINTS.URLS.BASEURL +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.GET
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

  // getBuyerByBuyerCode(buyerCode: string) {
  //   return this.http
  //     .get<Buyer>(
  //       APPARELPRO_ENDPOINTS.URLS.BASEURL +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.GETBY_BUYERCODE +
  //         buyerCode
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

  // createBuyer(buyer: Buyer): Observable<Buyer> {
  //   return this.http
  //     .post<Buyer>(
  //       APPARELPRO_ENDPOINTS.URLS.BASEURL +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.POST,
  //       buyer
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

  // deletebuyer(buyerCode: string) {
  //   return this.http
  //     .delete(
  //       APPARELPRO_ENDPOINTS.URLS.BASEURL +
  //         APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.DELETE +
  //         buyerCode
  //     )
  //     .pipe(
  //       catchError((err: any) => {
  //         return throwError(() => {
  //           return err;
  //         });
  //       })
  //     )
  //     .subscribe((res) => console.log('buyer deleted successfully'));
  // }
}
