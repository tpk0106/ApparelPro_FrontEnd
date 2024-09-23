import { Component, inject, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InjectorService } from '../Services/InjectorService';
import { APPAREL_PRO_UI_PARAMS } from '../misc/paramsConfig';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
} from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../misc/dialog/dialog.component';
import { ToastrService } from 'ngx-toastr';
import { AppProDialogComponent } from '../dialog/app-pro-dialog.component';

// https://nartc.me/blog/inheritance-angular-inject/

@Component({
  template: '',
})
export abstract class basetable<T> {
  constructor(
    protected service: InjectorService<T>,
    // private toastrService: ToastrService,
    @Inject('defaultSortColumn') defaultSortColumn: string,
    public appDialog: AppProDialogComponent<T>
  ) {
    this.filterChanged
      .asObservable()
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((queryToFilter) => {
        this.loadEntries(queryToFilter);
      });
    //  this.myDialog = appDialog;

    this.baseTableDialogConfig.height = '300px';
    this.baseTableDialogConfig.width = '500px';
    this.baseTableDialogConfig.hasBackdrop = false;
    this.baseTableDialogConfig.backdropClass = ['backdrop'];
    this.baseTableDialogConfig.panelClass = ['shadow-effects', 'dialog-color'];
  }
  baseTableDialogConfig = new MatDialogConfig();
  myDialog: any;
  columnsToDisplay: string[] = [];

  entries: MatTableDataSource<T> = new MatTableDataSource();

  defaultPageIndex = 0;
  defaultPageSize = 10;
  defaultSortColumn: string = 'name';
  defaultSortOrder: 'desc' | 'asc' = 'asc';

  defaultFilterColumn: string = 'name';
  filterQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // debouncing
  filterChanged = new BehaviorSubject<string>('');

  placeholder: string = 'filter.....';
  isDeleted: boolean = false;

  applyParams(): PageEvent {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = APPAREL_PRO_UI_PARAMS.paging.pageIndex;
    pageEvent.pageSize = APPAREL_PRO_UI_PARAMS.paging.pageSize;
    return pageEvent;
  }

  loadEntries(filter: string) {
    const pageEvent = this.applyParams();
    this.filterQuery = filter!;
    this.getEntries(pageEvent);
  }

  // EditEntry(entry: T) {
  //   console.log('edit entry : ');

  //   this.service.updateEntry(entry).subscribe({
  //     next: () => {},
  //     error: (error: any) => {
  //       console.log('ERROR : ', error.error);
  //       if (error.status == 403) {
  //         console.log('Error : ' + error.status);
  //       }
  //     },
  //     complete: () => {
  //       console.log('completed in basetable');
  //     },
  //   });
  // }

  getEntries(event: PageEvent) {
    const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;
    //  : APPAREL_PRO_UI_PARAMS.sorting.defaultSortColumn;

    const sortOrder = this.sort
      ? this.sort.direction
      : (APPAREL_PRO_UI_PARAMS.sorting.defaultSortOrder = 'asc');

    const filterColumn = this.filterQuery ? this.defaultFilterColumn : '';
    const filterQuery = this.filterQuery ? this.filterQuery : '';

    this.service
      .getEntries(
        event.pageIndex,
        event.pageSize,
        sortColumn,
        sortOrder,
        filterColumn,
        filterQuery
      )
      .subscribe({
        next: (res) => {
          this.paginator.pageIndex = res.currentPage;
          this.paginator.pageSize = res.pageSize;
          this.paginator.length = res.totalItems;
          this.entries = new MatTableDataSource(res.items);
        },
        error: (error: any) => {
          console.log('ERROR : ', error.error);
          if (error.status == 403) {
            console.log('Error : ' + error.status);
          }
        },
        complete: () => {
          console.log('completed');
        },
      });
  }

  imageDataUrl(data: any): string {
    const url: string = 'data:image/jpeg;base64,' + data;
    return url;
  }

  dialog = inject(MatDialog);

  editEntry(entry: T, _Component: Component) {
    // console.log('edit entry in base table component: ', entry);
    //  this.baseTableDialogConfig.height = '100px';
    // this.baseTableDialogConfig.width = '50px';
    //  this.baseTableDialogConfig.data = { model: entry };
    this.dialog
      .open(DialogComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe((_res) => {
        this.loadEntries(this.filterQuery);
        // this.toastrService.success(`country updated  Successfully, ${res}`);
      });

    // this.dialog
    //   .open(DialogComponent, {
    //     width: '35vw',
    //     position: {
    //       left: `${window.screenX + window.innerWidth / 2}px`,
    //       top: `${window.screenY + 150}px`,
    //     },
    //     panelClass: 'shadow-effects',
    //     backdropClass: 'Modal__overlay',
    //     // height: '95vh',
    //     data: { entry: entry },
    //   })
    //   .afterClosed()
    //   .subscribe((_res) => {
    //     this.loadEntries(this.filterQuery);
    //     // this.toastrService.success(`country updated  Successfully, ${res}`);
    //   });
  }

  addEntry(entry: T, _Component: Component) {
    console.log('edit entry in base component: ', entry);

    this.dialog
      .open(DialogComponent, {
        width: '30vw',
        position: {
          left: `${window.screenX + window.innerWidth / 2}px`,
          top: `${window.screenY + 150}px`,
        },
        panelClass: 'shadow-effects',
        backdropClass: 'Modal__overlay',
        // height: '95vh',
        data: { entry: entry },
      })
      .afterClosed()
      .subscribe((_res) => {
        this.loadEntries(this.filterQuery);
      });
  }

  deleteEntry(entry: T): Observable<any> {
    return this.service.deleteEntry(entry);

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
}
