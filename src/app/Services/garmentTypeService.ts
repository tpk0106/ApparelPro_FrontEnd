import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationAPIModel } from '../Models/ApiResult';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from './InjectorService';

import { APPARELPRO_ENDPOINTS } from '../misc/api-configurations';
import { Observable, catchError, throwError } from 'rxjs';
import { ApparelProWebAPIConfig } from '../misc/ApparelProWebAPIConfig';
import { GarmentType } from '../Models/References/GarmentType';

@Injectable({
  providedIn: 'root',
  // useClass: IService<GarmentType> ? GarmentTypeService : GarmentTypeService,
})
export class GarmentTypeService
  implements
    InjectorService<GarmentType>,
    DuplicateValidationInjectorService<GarmentType>
{
  readonly baseUrl: string = 'https://localhost:5000/';

  constructor(private http: HttpClient) {
    console.log('local [GarmentTypeService] : created');
  }

  deleteEntry(entry: GarmentType): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  isDuplicate(code: string): Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  addEntry(entry: GarmentType): Observable<any> {
    return this.http
      .post<GarmentType>(
        this.baseUrl + APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.POST,
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
  updateEntry(entry: GarmentType): Observable<any> {
    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.PUT,
        entry,
        {
          params: { id: entry.id },
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
  ): Observable<PaginationAPIModel<GarmentType>> {
    return this.http
      .get<PaginationAPIModel<GarmentType>>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.GET,
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

  getGarmentTypeByTypeCode(typeCode: string) {
    return this.http
      .get<GarmentType>(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.GETBY_TYPECODE +
          typeCode
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

  UpdateGarmentType(id: number, garmentType: GarmentType) {
    console.log('garment type', garmentType);

    return this.http
      .put(
        APPARELPRO_ENDPOINTS.URLS.BASEURL +
          APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.PUT,
        garmentType,
        {
          params: { id: id },
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
