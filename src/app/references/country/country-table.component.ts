import { Component, Inject } from '@angular/core';
import { Country } from '../../Models/References/Country';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { basetable } from '../../common/basetable';
import { MatPaginator } from '@angular/material/paginator';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../misc/dialog/dialog.component';

import { InjectorService } from '../../Services/InjectorService';
import { COUNTRY_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { CountryFormComponent } from './country-form.component';
import { ToastrService } from 'ngx-toastr';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';

@Component({
  selector: 'app-country-table',
  standalone: true,
  imports: [AngularMaterialModule, MatRadioButton, MatRadioGroup, MatPaginator],
  templateUrl: './country-table.component.html',
  styleUrl: './country-table.component.css',
})
export class CountryTableComponent extends basetable<Country> {
  constructor(
    @Inject(COUNTRY_SERVICE_PLUGIN) service: InjectorService<Country>,
    private toastrService: ToastrService,
    @Inject('defaultSortColumn') defaultSortCol: string,
    dialog: MatDialogRef<DialogComponent>
  ) {
    super(service, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;
  override filterChanged: BehaviorSubject<string> = this.filterChanged;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override columnsToDisplay: string[] = [
    'id',
    'code',
    'name',
    'flag',
    'action',
  ];

  countries = new MatTableDataSource<Country, MatPaginator>();
  add: boolean = false;
  newCountry!: Country;

  getCountries() {
    this.service
      .getEntries(
        this.defaultPageIndex,
        this.defaultPageSize,
        this.defaultSortColumn,
        this.defaultSortOrder,
        this.defaultFilterColumn,
        this.filterQuery
      )
      .subscribe((res: { items: Country[] }) => {
        this.countries = new MatTableDataSource(res.items);
      });
  }

  ngOnInit() {
    super.loadEntries(this.filterQuery);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  override editEntry(country: Country): void {
    this.baseTableDialogConfig.height = '600px';
    this.baseTableDialogConfig.width = '300px';
    this.baseTableDialogConfig.data = { model: country };
    this.dialog
      .open(CountryFormComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
        //  this.toastrService.success(`country updated  Successfully, ${res}`);
      });
  }

  override addEntry(entry: Country): void {
    this.baseTableDialogConfig.height = '600px';
    this.baseTableDialogConfig.width = '300px';
    this.baseTableDialogConfig.data = { model: {} };

    this.dialog
      .open(CountryFormComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  deleteCountry(country: Country) {
    super.deleteEntry(country).subscribe({
      next: (res) => {
        this.toastrService.success(`country, deleted  Successfully`);
      },
      error: (error: any) => {
        // console.log('ERROR : ', error.error);
        if (error.status == 403) {
          console.log('Error : ' + error.status);
        }
      },
      complete: () => {
        console.log('deletion completed');
      },
    });
  }

  // addEntry1(country: Country) {
  //   this.add = true;
  //   this.dialog
  //     .open(CountryFormComponent, { data: { country: country } })
  //     .afterClosed()
  //     .subscribe(() => {
  //       super.loadEntries(this.filterQuery);
  //       //  this.toastrService.success(`country updated  Successfully, ${res}`);
  //     });
  // }

  // // constructor(
  // //   fb: FormBuilder,
  // //   countryService: CountryService,
  // //   toastrService: ToastrService,
  // //   errorHandlerService: ErrorHandlerService,
  // //   @Inject(routes) route: Route,
  // //   authService: AuthenticationService,
  // //   activatedRoute: ActivatedRoute,
  // //   @Inject(MAT_DIALOG_DATA) public override data: Country
  // // ) {
  // //   super(
  // //     fb,
  // //     countryService,
  // //     toastrService,
  // //     errorHandlerService,
  // //     activatedRoute,
  // //     authService,
  // //     activatedRoute,
  // //     data
  // //   );
  // // }
  // constructor(
  //   private countryService: CountryService,
  //   authService: AuthenticationService,
  //   private toastrService: ToastrService
  // ) {
  //   this.filterChanged
  //     .asObservable()
  //     .pipe(debounceTime(700), distinctUntilChanged())
  //     .subscribe((queryToFilter) => {
  //       this.loadCountries(queryToFilter);
  //     });
  //   this.isAuthenticated = authService.isAuthenticated();
  // }
  // @Input() countries: MatTableDataSource<Country> = new MatTableDataSource();
  // // paging para
  // defaultPageIndex = 0;
  // defaultPageSize = 10;
  // defaultSortColumn: string = 'name';
  // defaultSortOrder: 'desc' | 'asc' = 'asc';
  // defaultFilterColumn: string = 'name';
  // filterQuery: string = '';
  // isAuthenticated: boolean = false;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  // // debouncing
  // filterChanged = new BehaviorSubject<string>('');
  // //
  // country!: Country;
  // tableColumns: string[] = ['id', 'name', 'code', 'flag'];
  // placeholder: string = 'filter.....';
  // radioChange($event: MatRadioChange) {
  //   console.log($event.value);
  //   this.defaultFilterColumn = $event.value;
  //   this.placeholder = `filter by ${$event.value} ...`;
  // }
  // readonly dialog = inject(MatDialog);
  // editCountry(country: Country) {
  //   this.dialog
  //     .open(CountryFormComponent, {
  //       width: '30vw',
  //       position: {
  //         left: `${window.screenX + window.innerWidth / 2}px`,
  //         top: `${window.screenY + 150}px`,
  //       },
  //       panelClass: 'shadow-effects',
  //       backdropClass: 'Modal__overlay',
  //       // height: '95vh',
  //       data: { country: country },
  //     })
  //     .afterClosed()
  //     .subscribe((res) => {
  //       this.loadCountries(this.filterQuery);
  //       // this.toastrService.success(`country updated  Successfully, ${res}`);
  //     });
  // }
  // // closeDialog() {
  // //   this.dialog.closeAll();
  // // }
  // ngOnInit() {
  //   this.loadCountries(this.filterQuery);
  // }
  // loadCountry(code: string): Observable<Country> {
  //   return this.countryService.getCountryByCode(code);
  // }
  // loadCountries(filter: string) {
  //   const pageEvent = this.applyParams();
  //   this.filterQuery = filter!;
  //   this.getCountries(pageEvent);
  // }
  // applyParams(): PageEvent {
  //   const pageEvent = new PageEvent();
  //   pageEvent.pageIndex = APPAREL_PRO_UI_PARAMS.paging.pageIndex;
  //   pageEvent.pageSize = APPAREL_PRO_UI_PARAMS.paging.pageSize;
  //   return pageEvent;
  // }
  // getCountries(event: PageEvent) {
  //   const sortColumn = this.sort
  //     ? this.sort.active
  //     : APPAREL_PRO_UI_PARAMS.sorting.defaultSortColumn;
  //   const sortOrder = this.sort
  //     ? this.sort.direction
  //     : (APPAREL_PRO_UI_PARAMS.sorting.defaultSortOrder = 'asc');
  //   // const filterColumn = this.filterQuery
  //   //   ? APPAREL_PRO_UI_PARAMS.filtering.defaultFilterColumn
  //   //   : '';
  //   const filterColumn = this.filterQuery ? this.defaultFilterColumn : '';
  //   const filterQuery = this.filterQuery ? this.filterQuery : '';
  //   this.countryService
  //     .getEntries(
  //       event.pageIndex,
  //       event.pageSize,
  //       sortColumn,
  //       sortOrder,
  //       filterColumn,
  //       filterQuery
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         this.paginator.pageIndex = res.currentPage;
  //         this.paginator.pageSize = res.pageSize;
  //         this.paginator.length = res.totalItems;
  //         this.countries = new MatTableDataSource(res.items);
  //       },
  //       error: (error: any) => {
  //         console.log('ERROR : ', error.error);
  //         if (error.status == 403) {
  //           console.log('Error : ' + error.status);
  //         }
  //       },
  //       complete: () => {
  //         console.log('completed');
  //       },
  //     });
  // }
  // // updateImage($event: Event) {
  // //   const reader = new FileReader();
  // //   reader.onload = (e) => {
  // //     this.imgSrc = e.target?.result;
  // //     let binaryResult = this.convertDataURIToBinary(reader.result);
  // //     var decodedStringBtoA = this.stringFromArray(binaryResult);
  // //     var encodedStringBtoA = window.btoa(decodedStringBtoA); //  Base64-encoded ASCII string from a binary string - encode
  // //     this.fileResult = encodedStringBtoA;
  // //   };
  // //   this.imgSrc = reader.readAsDataURL(
  // //     ($event.target as HTMLInputElement).files![0]
  // //   );
  // // }
  // imageDataUrl(data: any): string {
  //   const url: string = 'data:image/jpeg;base64,' + data;
  //   return url;
  // }
  // convertDataURIToBinary(dataURI: any) {
  //   var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
  //   var base64 = dataURI.substring(base64Index);
  //   var raw = window.atob(base64); // create ASCII string containing decoded data from encodedData - decode
  //   var rawLength = raw.length;
  //   var array = new Uint8Array(new ArrayBuffer(rawLength));
  //   for (var i = 0; i < rawLength; i++) {
  //     array[i] = raw.charCodeAt(i);
  //   }
  //   return array;
  // }
  // stringFromArray(data: any) {
  //   var count = data.length;
  //   var str = '';
  //   for (var index = 0; index < count; index += 1)
  //     str += String.fromCharCode(data[index]);
  //   return str;
  // }
}
