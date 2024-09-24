import { Component, Inject } from '@angular/core';
import {
  DuplicateValidationInjectorService,
  InjectorService,
} from '../Services/InjectorService';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../auth/authentication.service';
import { catchError, Observable, throwError } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  template: '',
})
export abstract class baseform<T> {
  constructor(
    protected baseService: InjectorService<T>,
    private baseValidationService: DuplicateValidationInjectorService<T>,
    @Inject(MAT_DIALOG_DATA)
    public data: { model: T }
  ) {}

  edit: boolean = false;
  id: number = 0;

  caption: string = 'Submit';

  ngOnInit() {}

  addEntry(entry: T): Observable<any> {
    console.log('entry in baseform', entry);

    return this.baseService.addEntry(entry).pipe(
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
        // console.error('Hi Thusith an error occurred:', error);
        // Optionally, re-throw the error or return a default value
        return throwError(() => {
          error.timestamp = Date.now();
          return error;
        });
      })
    );
    //  .subscribe((res) => {});
  }

  editEntry(entry: T): Observable<any> {
    console.log('execute EDIT in base form:');

    return this.baseService.updateEntry(entry).pipe(
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
        //console.error('Hi Thusith an error occurred in BASEFORM :', error);
        // Optionally, re-throw the error or return a default value
        return throwError(() => {
          error.timestamp = Date.now();
          return error;
        });
      })
    );
    //  .subscribe(() => {});
  }

  isDuplicated(code: string, extra?: string): Observable<boolean> {
    return this.baseValidationService.isDuplicate(code, extra);
  }

  imageDataUrl(data: any): string {
    const url: string = 'data:image/jpeg;base64,' + data;
    return url;
  }
}
