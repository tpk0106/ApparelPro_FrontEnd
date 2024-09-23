import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APPARELPRO_ENDPOINTS } from '../../misc/api-configurations';
import { Observable, catchError, throwError } from 'rxjs';
import { PurchaseOrder } from '../../Models/OrderManagement/PurchaseOrder';
import { PaginationAPIModel } from '../../Models/ApiResult';

@Injectable({
  providedIn: 'root',
})
export class POService {
  constructor(private http: HttpClient) {}

  // ApparelProWebAPIConfig!: ApparelProWebAPIConfig;

  getEntries(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ): Observable<PaginationAPIModel<PurchaseOrder>> {
    return this.http
      .get<PaginationAPIModel<PurchaseOrder>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.PO.GET,
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

  getPOByPONo(poNo: string) {
    return this.http
      .get<PurchaseOrder>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.PO.GETBY_PONO +
          poNo
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

  createPO(po: PurchaseOrder): Observable<PurchaseOrder> {
    return this.http
      .post<PurchaseOrder>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.PO.POST,
        po
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

  UpdatePO(buyerCode: number, order: string, po: PurchaseOrder) {
    console.log('po', po);

    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.PO.PUT +
          order +
          order,
        po
      )
      .pipe(
        catchError((err: any) => {
          return throwError(() => {
            return err;
          });
        })
      );
  }

  deletePo(poNo: number) {
    return this.http
      .delete(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.PO.DELETE +
          poNo
      )
      .pipe(
        catchError((err: any) => {
          return throwError(() => {
            return err;
          });
        })
      )
      .subscribe((res) => console.log('PO deleted successfully'));
  }
}
