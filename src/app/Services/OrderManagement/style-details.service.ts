import { Injectable } from '@angular/core';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from '../InjectorService';
import { Style } from '../../Models/OrderManagement/Style';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { APPARELPRO_ENDPOINTS } from '../../misc/api-configurations';
import { PaginationAPIModel } from '../../Models/ApiResult';

@Injectable({
  providedIn: 'root',
})
export class StyleDetailsService
  implements InjectorService<Style>, DuplicateValidationInjectorService<Style>
{
  readonly baseUrl: string = 'https://localhost:5000/';

  constructor(private http: HttpClient) {}

  deleteEntry(entry: Style): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  isDuplicate(code: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.baseUrl +
        APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.STYLE_DETAILS.DOES_STYLE_EXIST +
        code
    );
  }

  // base class methods
  addEntry(entry: Style): Observable<any> {
    console.log('ADD inside style details service.....', entry);

    // let style: Style = <Style>{};
    // style = entry;
    //console.log('ADD inside style details service.....style', style);

    return this.http
      .post<Style>(
        this.baseUrl + APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.STYLE_DETAILS.POST,
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

  updateEntry(entry: Style): Observable<any> {
    // console.log('UPDATE inside style details service =======>>>>>>>>>>', entry);
    // return this.http
    //   .put(
    //     this.baseUrl + APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.STYLE_DETAILS.PUT,
    //     entry
    //   )
    //   .pipe(myfunc());

    return this.http
      .put(
        this.baseUrl + APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.STYLE_DETAILS.PUT,
        entry,
        {
          params: {
            buyerCode: entry.buyerCode,
            order: entry.order,
            typeCode: entry.typeCode,
            style: entry.styleCode,
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

  getEntries(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<Style>> {
    return this.http
      .get<PaginationAPIModel<Style>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.STYLE_DETAILS.GET_BY_PAGINATION,
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
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.STYLE_DETAILS.DOES_STYLE_EXIST +
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

  getStyleDetailsByBuyerAndOrder(
    buyer: number,
    order: string,
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<Style>> {
    // console.log('inside getStyleDetailsByBuyerAndOrder method');

    return this.http
      .get<PaginationAPIModel<Style>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.STYLE_DETAILS
            .GET_STYLE_DETAILS_BY_BUYER_AND_ORDER,
        {
          params: {
            buyerCode: buyer,
            order: order,
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
}

// function processErrors(
//   error: any
// ): import('rxjs').OperatorFunction<Object, any> {
//   console.log('executed.........');

//   if (error.status == 401) {
//     console.log('Error : ', error.status + ' : ' + error);
//   }
//   if (error.status == 403) {
//     console.error(
//       `Backend returned code ${error.status}, body was: `,
//       error.error
//     );
//   }

//   console.error('Hi Thusith an error occurred:', error);
//   // Optionally, re-throw the error or return a default value
//   return throwError(() => {
//     error.timestamp = Date.now();
//     return error;
//   }};
