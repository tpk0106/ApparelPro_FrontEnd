import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../utilities/button/button.component';
//import { country } from '../../Models/References/country';
//import { CurencyService } from '../../Services/countryService';
import { Country } from '../../Models/References/Country';
import { CountryService } from '../../Services/countryService';
import { NgIf } from '@angular/common';
import { STATUS } from '../../misc/status-info';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../paging/page/page.component';
import { FieldComponent } from '../../utilities/field/field.component';
import { MatTableDataSource } from '@angular/material/table';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from '../../auth/authentication.service';
import { MatAnchor } from '@angular/material/button';

import { APPAREL_PRO_UI_PARAMS } from '../../misc/paramsConfig';
import { RouterLink } from '@angular/router';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import {
  DialogRole,
  MatDialog,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { AppProDialogComponent } from '../../dialog/app-pro-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { CountryTableComponent } from './country-table.component';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    NgIf,
    PageComponent,
    FieldComponent,
    AngularMaterialModule,
    RouterLink,
    MatAnchor,
    MatRadioButton,
    MatDialogActions,
    MatDialogContent,
    CountryTableComponent,
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryComponent {
  //export class CountryComponent extends AppProDialogComponent<CountryComponent> {
  caption: string = 'Submit';
  //  caption: string = 'Submit';
  width: number = 245;
  //  width: number = 245;
  $event: any;

  isAuthenticated: boolean = false;

  // angular material
  tableColumns: string[] = ['id', 'name', 'code', 'flag'];
  countries: MatTableDataSource<Country> = new MatTableDataSource();

  // paging para
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
  //

  placeholder: string = 'filter.....';
  countryForm!: FormGroup;
  country!: Country;
  currencies: Country[] = [];

  //filteredEntries: Country[] = [];
  imgSrc: any = '../../../assets/Image-place-holder.png';
  fileResult: any;
  OPERATION: STATUS = STATUS.ADDNEW;

  //  filteredData: any;

  name!: string;
  code!: string;
  flag!: BinaryType;
  id!: number;

  visibleDialog: boolean = true;
  readonly dialog = inject(MatDialog);
  // readonly dialogRef = inject(MatDialogRef<CountryComponent>);
  openDialog(): void {
    //this.visibleDialog = true;
    // this.dialogRef.open(CountryComponent, {
    //   width: '400p',
    //   data: { country: this.country },
    // });
    this.dialog.open(CountryComponent, {
      width: '500px',
      data: { country: this.country },
    });
  }

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private toastrService: ToastrService,
    private errorHandlerService: ErrorHandlerService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    //  private dialogRef: MatDialogRef<CountryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Country
  ) {
    //  super();

    this.filterChanged
      .asObservable()
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((queryToFilter) => {
        console.log(queryToFilter);

        this.loadCountries(queryToFilter);
      });
    this.isAuthenticated = authService.isAuthenticated();
  }

  init(): void {
    console.log('Init');
  }

  radioChange($event: MatRadioChange) {
    console.log($event.value);
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  ngOnInit() {
    this.loadCountries(this.filterQuery);

    this.countryForm = this.fb.group({
      name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      code: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      flag: ['', Validators.required],
    });
    this.country = this.countryForm.value;
    this.imgSrc = './assets/Image-place-holder.png';
    this.visibleDialog = true;
  }

  //https://www.worldometers.info/geography/flags-of-the-world/
  // https://www.iban.com/country-codes
  // loadCountry(code: string): Observable<Country> {
  //   return this.countryService.getCountryByCode(code);
  // }

  onCancel($event: MouseEvent) {
    //  console.log('BUTTON CLICK : ', $event);

    this.fileResult = '';
    this.imgSrc = './assets/Image-place-holder.png';
    this.countryForm.reset();
  }

  onEdit(code: string, name: string) {
    // this.loadCountry(code).subscribe((response) => {
    //   {
    //     this.country = response;
    //     this.countryForm = this.fb.group({
    //       code: [
    //         this.country.code,
    //         Validators.compose([
    //           Validators.required,
    //           Validators.minLength(2),
    //           Validators.maxLength(3),
    //         ]),
    //       ],
    //       name: [
    //         this.country.name,
    //         Validators.compose([Validators.required, Validators.maxLength(30)]),
    //       ],
    //       flag: [this.country.flag, Validators.required],
    //     });
    //     //   console.log('country image : ', this.country.flag);
    //     this.fileResult = this.country.flag;
    //     this.imgSrc = this.imageDataUrl(this.country.flag);
    //   }
    // });
    // console.log('loaded partailly');
    // this.countryForm.patchValue({
    //   code: code,
    //   name: name,
    //   flag: this.country.flag,
    // });
    // this.OPERATION = STATUS.EDIT;
    // console.log('loaded partailly');
  }

  onDelete(code: string) {
    // this.countryService.deleteCountry(code).subscribe(() => {
    //   this.toastrService.success(`country, ${{ code }} deleted Successfully`);
    // });
  }

  loadCountries(filter: string) {
    const pageEvent = this.applyParams();
    this.filterQuery = filter!;
    this.getCountries(pageEvent);
  }

  applyParams(): PageEvent {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = APPAREL_PRO_UI_PARAMS.paging.pageIndex;
    pageEvent.pageSize = APPAREL_PRO_UI_PARAMS.paging.pageSize;
    return pageEvent;
  }

  getCountries(event: PageEvent) {
    const sortColumn = this.sort
      ? this.sort.active
      : APPAREL_PRO_UI_PARAMS.sorting.defaultSortColumn;

    const sortOrder = this.sort
      ? this.sort.direction
      : (APPAREL_PRO_UI_PARAMS.sorting.defaultSortOrder = 'asc');

    // const filterColumn = this.filterQuery
    //   ? APPAREL_PRO_UI_PARAMS.filtering.defaultFilterColumn
    //   : '';

    const filterColumn = this.filterQuery ? this.defaultFilterColumn : '';
    const filterQuery = this.filterQuery ? this.filterQuery : '';

    this.countryService
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
          this.countries = new MatTableDataSource(res.items);
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

  // addCountry(country: Country) {
  //   country.flag = this.fileResult;
  //   console.log('country : ', country);

  //   if (this.OPERATION == STATUS.ADDNEW) {
  //     this.countryService.addCountry(country).subscribe({
  //       next: (country) => () => {},
  //       error: (err) => {
  //         const error: string = err.error;
  //         // this.subscribedMessage.next(error);
  //         this.errorHandlerService.handleError(err);
  //         // this.isSubscribed.next(true);
  //       },
  //       complete: () => {
  //         console.log('complete');

  //         this.toastrService.success(
  //           `country added Successfully, ${country.code}`
  //         );
  //       },
  //     });
  //   } else if (this.OPERATION == STATUS.EDIT) {
  //     this.code = country.code;
  //     this.name = country.name;
  //     this.flag = country.flag;
  //     this.countryService.UpdateCountry(this.code, country).subscribe({
  //       next: (country) => () => {},
  //       error: (err) => {
  //         const error: string = err.error;
  //         // this.subscribedMessage.next(error);
  //         this.errorHandlerService.handleError(err);
  //         // this.isSubscribed.next(true);
  //       },
  //       complete: () => {
  //         this.toastrService.success(
  //           `country added Successfully, ${country.code}`
  //         );
  //       },
  //     });
  //   }
  // }

  updateImage($event: Event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;

      let binaryResult = this.convertDataURIToBinary(reader.result);
      var decodedStringBtoA = this.stringFromArray(binaryResult);
      var encodedStringBtoA = window.btoa(decodedStringBtoA); //  Base64-encoded ASCII string from a binary string - encode

      this.fileResult = encodedStringBtoA;
    };

    this.imgSrc = reader.readAsDataURL(
      ($event.target as HTMLInputElement).files![0]
    );
  }

  imageDataUrl(data: any): string {
    const url: string = 'data:image/jpeg;base64,' + data;
    return url;
  }
  convertDataURIToBinary(dataURI: any) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64); // create ASCII string containing decoded data from encodedData - decode
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  stringFromArray(data: any) {
    var count = data.length;
    var str = '';

    for (var index = 0; index < count; index += 1)
      str += String.fromCharCode(data[index]);

    return str;
  }
}
