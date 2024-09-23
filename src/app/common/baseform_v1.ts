import { Component, Inject } from '@angular/core';
import { InjectorService } from '../Services/InjectorService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControlService } from './form-control.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../misc/error-handler.service';
import { AuthenticationService } from '../auth/authentication.service';
import { catchError, throwError } from 'rxjs';
import { MyControl } from './IControl';

@Component({
  template: '',
})
export abstract class baseform_v1<T> {
  constructor(
    // **************** working
    private fcs: FormControlService<T>,
    //***************************** */
    //  @Inject('form') _controls: MyControl[],
    protected baseService: InjectorService<T>,
    protected toastrService: ToastrService,
    protected errorHandlerService: ErrorHandlerService,
    protected authService: AuthenticationService
  ) {
    //  this.form = fcs.buildFormGroup();
    console.log(this.form);
  }

  form!: FormGroup;
  fb!: FormBuilder;
  edit: boolean = false;
  id: number = 0;

  // paging para
  // defaultPageIndex = 0;
  // defaultPageSize = 10;
  // defaultSortColumn: string = 'name';
  // defaultSortOrder: 'desc' | 'asc' = 'asc';

  // defaultFilterColumn: string = 'name';
  caption: string = 'Submit';
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    console.log(this.form);
  }

  addEntry(entry: T): void {
    //   this.countrySrv.addEntry(entry).subscribe((res) => {});

    this.baseService
      .addEntry(entry)
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
      )
      .subscribe((res) => {});
  }

  editEntry(entry: T) {
    console.log('execute base form edit');

    this.baseService
      .updateEntry(entry)
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
      )
      .subscribe((res) => {});
  }
}
