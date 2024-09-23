import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CurrencyExchange } from '../../Models/References/CurrencyExchange';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CurrencyExchangeService } from '../../Services/currency-exchange.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgIf, NgFor } from '@angular/common';
import { CountryService } from '../../Services/countryService';
import { baseform } from '../../common/baseform';
import { InjectorService } from '../../Services/InjectorService';
import { CURRENCY_EXCHANGE_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { Currency } from '../../Models/References/Currency';
import { CurrencyService } from '../../Services/currencyService';

@Component({
  selector: 'app-currency-exchange-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    MatDialogContent,
    MatDatepickerModule,
    MatDialogActions,
    NgIf,
    NgFor,
  ],
  templateUrl: './currency-exchange-form.component.html',
  styleUrl: './currency-exchange-form.component.css',
})
export class CurrencyExchangeFormComponent extends baseform<CurrencyExchange> {
  currencyExchangeForm!: FormGroup;
  currencyExchange!: CurrencyExchange;

  currencies: Currency[] = [];

  baseCurrency!: string;
  quoteCurrency!: string;
  rate!: number;
  exchangeDate!: string;
  tableColumns: string[] = [
    'baseCurrency',
    'rate',
    'quoteCurrency',
    'exchangeDate',
  ];

  isAuthenticated: boolean = false;
  currencyExchanges: MatTableDataSource<CurrencyExchange> =
    new MatTableDataSource();
  width: number = 100;

  // debouncing
  filterChanged = new BehaviorSubject<string>('');
  //
  override id: number = 0;
  baseCurr!: boolean;
  quoteCurr!: boolean;
  currRate!: number;

  fb: FormBuilder = new FormBuilder();

  placeholder: string = 'filter.....';

  constructor(
    @Inject(CURRENCY_EXCHANGE_SERVICE_PLUGIN)
    currencyExchangeService: InjectorService<CurrencyExchange>,
    validationService: CurrencyExchangeService,
    private toastrService: ToastrService,
    // protected override errorHandlerService: ErrorHandlerService,
    // protected override authService: AuthenticationService,
    private dialogRef: MatDialogRef<CurrencyExchangeFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: CurrencyExchange },
    private currencyService: CurrencyService
  ) {
    super(
      currencyExchangeService,
      validationService,
      // toastrService,
      // errorHandlerService,
      // authService,
      data
    );

    this.currencyExchangeForm = this.fb.group({
      baseCurrency: [
        data.model.baseCurrency,
        Validators.compose([Validators.required]),
      ],
      quoteCurrency: [
        data.model.quoteCurrency,
        Validators.compose([Validators.required]),
      ],
      rate: [data.model.rate, Validators.compose([Validators.required])],
      exchangeDate: [
        data.model.exchangeDate,
        Validators.compose([Validators.required]),
      ],
    });

    this.currencyService
      .getEntries(0, 9999, 'code', 'asc', '', '')
      .subscribe((res) => {
        this.currencies = res.items;
      });
    this.currencyExchange = this.currencyExchangeForm.value;

    this.edit = data.model.quoteCurrency ? true : false;

    if (!this.edit)
      this.currencyExchangeForm.setAsyncValidators(
        this.isDuplicateCurrencyExchange()
      ); // assign validator func here
  }

  override ngOnInit() {
    this.id = this.data.model.id;
    //   this.loadCurrencies();
    //  this.loadCurrencyExchanges(this.filterQuery);
  }

  // loadCurrencyExchanges(filter: string) {
  //   const pageEvent = this.applyParams();
  //   this.filterQuery = filter!;
  //   this.getCurrencyExchanges(pageEvent);
  // }

  // applyParams(): PageEvent {
  //   const pageEvent = new PageEvent();
  //   pageEvent.pageIndex = APPAREL_PRO_UI_PARAMS.paging.pageIndex;
  //   pageEvent.pageSize = APPAREL_PRO_UI_PARAMS.paging.pageSize;
  //   return pageEvent;
  // }

  // getCurrencyExchanges(event: PageEvent) {
  //   const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;

  //   const sortOrder = this.sort
  //     ? this.sort.direction
  //     : (APPAREL_PRO_UI_PARAMS.sorting.defaultSortOrder = 'asc');

  //   const filterColumn = this.filterQuery ? this.defaultFilterColumn : '';

  //   const filterQuery = this.filterQuery ? this.filterQuery : '';

  //   // this.currencyExchangeService
  //   //   .getCurrencyExchanges(
  //   //     event.pageIndex,
  //   //     event.pageSize,
  //   //     sortColumn,
  //   //     sortOrder,
  //   //     filterColumn,
  //   //     filterQuery
  //   //   )
  //   //   .subscribe({
  //   //     next: (res) => {
  //   //       this.paginator.pageIndex = res.currentPage;
  //   //       this.paginator.pageSize = res.pageSize;
  //   //       this.paginator.length = res.totalItems;
  //   //       this.currencyExchanges = new MatTableDataSource(res.items);
  //   //       console.log(res);
  //   //     },
  //   //     error: (error: any) => {
  //   //       console.log('ERROR : ', error.error);
  //   //       if (error.status == 403) {
  //   //         console.log('Error : ' + error.status);
  //   //       }
  //   //     },
  //   //     complete: () => {
  //   //       console.log('completed');
  //   //     },
  //   //   });
  // }

  closeDialog() {
    this.dialogRef.close();
  }

  // radioChange($event: MatRadioChange) {
  //   console.log($event.value);
  //   this.defaultFilterColumn = $event.value;
  //   this.placeholder = `filter by ${$event.value} ...`;
  // }
  // input format : dd/mm/yyyyy
  // output format : JS Date Object with updated current time
  convertStringToDateObject(str: string): Date {
    const parts = str.split('/');

    // Note: Month values are "indexed" in JS (e.g. January is "0")
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    const date: Date = new Date(
      +parts[2],
      +parts[1] - 1,
      +parts[0],
      hours,
      minutes,
      seconds
    );

    return date;
  }

  // updateEntry() {
  //   console.log('ID : ', this.id);

  //   const currencyExchange =
  //     this.id > 0 ? this.currencyExchange : <CurrencyExchange>{};
  //   if (currencyExchange) {
  //     //   currencyExchange.id = this.currencyExchangeForm.controls['id'].value;
  //     currencyExchange.baseCurrency =
  //       this.currencyExchangeForm.controls['baseCurrency'].value;
  //     currencyExchange.quoteCurrency =
  //       this.currencyExchangeForm.controls['quoteCurrency'].value;
  //     currencyExchange.rate = this.currencyExchangeForm.controls['rate'].value;
  //     currencyExchange.exchangeDate =
  //       this.currencyExchangeForm.controls['exchangeDate'].value;
  //   }

  //   console.log('id :', this.id);

  //   if (this.id > 0) {
  //     return this.currencyExchangeService
  //       .updateEntry(currencyExchange)
  //       .subscribe({
  //         next: () => {},
  //         error: (err) => {
  //           const error: string = err.error;
  //           // this.subscribedMessage.next(error);
  //           this.errorHandlerService.handleError(err);
  //           // this.isSubscribed.next(true);
  //         },
  //         complete: () => {
  //           this.toastrService.success(
  //             `currencyExchange: ${currencyExchange.baseCurrency} => ${currencyExchange.quoteCurrency} updated Successfully`
  //           );
  //           this.dialogRef.close();
  //         },
  //       });
  //   } else {
  //     return this.currencyExchangeService.addEntry(currencyExchange).subscribe({
  //       next: () => {},
  //       error: (err) => {
  //         const error: string = err.error;
  //         // this.subscribedMessage.next(error);
  //         this.errorHandlerService.handleError(err);
  //         // this.isSubscribed.next(true);
  //       },
  //       complete: () => {
  //         this.toastrService.success(
  //           `currencyExchange: ${currencyExchange.baseCurrency} => ${currencyExchange.quoteCurrency}, added Successfully`
  //         );
  //         this.dialogRef.close();
  //       },
  //     });
  //   }
  // }

  // editEntry(currencyExchange: CurrencyExchange): void {
  //   this.dialog
  //     .open(CurrencyExchangeFormComponent, {
  //       data: { currencyExchange: currencyExchange },
  //     })
  //     .afterClosed()
  //     .subscribe(() => {
  //       this.loadEntries(this.filterQuery);
  //       //  this.toastrService.success(`currencyExchange updated  Successfully, ${res}`);
  //     });
  // }
  // addCurrencyExchange(currencyExchange: CurrencyExchange) {
  //   // console.log(
  //   //   'toDateString : ',
  //   //   currencyExchange.exchangeDate.toDateString()
  //   // );
  //   // console.log(
  //   //   'toLocaleDateString : ',
  //   //   currencyExchange.exchangeDate.toLocaleDateString()
  //   // );
  //   // console.log('toISOString : ', currencyExchange.exchangeDate.toISOString());
  //   // console.log('toJSON : ', currencyExchange.exchangeDate.toJSON());
  //   // console.log(
  //   //   'toLocaleString : ',
  //   //   currencyExchange.exchangeDate.toLocaleString()
  //   // );
  //   // console.log(
  //   //   'toLocaleTimeString : ',
  //   //   currencyExchange.exchangeDate.toLocaleTimeString()
  //   // );

  //   const localDate = currencyExchange.exchangeDate.toLocaleDateString();
  //   const convertedDate = this.convertStringToDateObject(localDate);
  //   currencyExchange.exchangeDate = convertedDate;
  //   //console.log('convertStringToDateObject : ', convertedDate);

  //   this.currencyExchangeService
  //     .addCurrencyExchange(currencyExchange)
  //     .subscribe({
  //       next: (currency) => () => {},
  //       error: (err) => {
  //         const error: string = err.error;
  //         // this.subscribedMessage.next(error);
  //         // this.errorHandlerService.handleError(err);
  //         // this.isSubscribed.next(true);
  //       },
  //       complete: () => {
  //         //  this.loadCurrencyExchanges();
  //         // this.toastrService.success(
  //         //   `Currency added Successfully, ${currency.code}`
  //         // );
  //         this.currencyExchangeForm.reset();
  //       },
  //     });
  // }

  submitEntry(entry: CurrencyExchange) {
    const currencyExchange = this.id > 0 ? entry : <CurrencyExchange>{};
    if (currencyExchange) {
      currencyExchange.baseCurrency =
        this.currencyExchangeForm.controls['baseCurrency'].value;
      currencyExchange.quoteCurrency =
        this.currencyExchangeForm.controls['quoteCurrency'].value;
      currencyExchange.rate = this.currencyExchangeForm.controls['rate'].value;
      currencyExchange.exchangeDate =
        this.currencyExchangeForm.controls['exchangeDate'].value;
    }
    if (this.id > 0) {
      super.editEntry(currencyExchange);
    } else {
      super.addEntry(currencyExchange);
      this.toastrService.success(
        `currencyExchange: ${currencyExchange.baseCurrency} to ${currencyExchange.quoteCurrency} updated Successfully`
      );
    }
    this.closeDialog();
  }

  isDuplicateCurrencyExchange(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      var code = this.currencyExchangeForm.controls['code'].value;
      return super.isDuplicated(code).pipe(
        map((res: any) => {
          return res ? { isDuplicateUnit: true } : null;
        })
      );
    };
  }

  // onCancel(event: Event) {}
  // onPageClick(data: any) {
  //   //  console.log('onPageClick : ', data.filteredEntries);
  //   //   this.filteredEntries = data.filteredEntries;
  // }

  // onEdit(baseCurrency: string) {
  //   //  this.currencyExchangeService.
  //   console.log(this.currencyExchange);
  // }

  // onUpdate() {}

  // onDelete(baseCurrency: string) {}

  Isrequired() {
    return 'class-is-invalid:this.currencyExchange.baseCurrency && this.currencyExchange.quoteCurrency';
  }

  // showMe(event: Event) {
  //   const ele = event.target as HTMLInputElement;
  //   ele.focus();
  // }
}
