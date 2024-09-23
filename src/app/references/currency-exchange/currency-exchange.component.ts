import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import { CurrencyExchange } from '../../Models/References/CurrencyExchange';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../utilities/button/button.component';
import { NgFor, NgIf, formatDate } from '@angular/common';
import { PageComponent } from '../../paging/page/page.component';
import { CurrencyService } from '../../Services/currencyService';
import { Currency } from '../../Models/References/Currency';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyExchangeService } from '../../Services/currency-exchange.service';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PrimeIcons } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { APPAREL_PRO_UI_PARAMS } from '../../misc/paramsConfig';
import { AuthenticationService } from '../../auth/authentication.service';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-currency-exchange',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    NgIf,
    NgFor,
    PageComponent,
    NgbDatepicker,
    NgbModule,
    DatePipe,
    JsonPipe,
    NgClass,
    CalendarModule,
    ButtonModule,
    FloatLabelModule,
    DropdownModule,
    AngularMaterialModule,
    MatDatepickerModule,
    MatRadioButton,
  ],
  templateUrl: './currency-exchange.component.html',
  styleUrl: './currency-exchange.component.css',
})
export class CurrencyExchangeComponent {
  [x: string]: any;
  constructor(
    private fb: FormBuilder,
    private errorHandlerServive: ErrorHandlerService,
    private currencyService: CurrencyService,
    private currencyExchangeService: CurrencyExchangeService,
    private authService: AuthenticationService
  ) {
    this.filterChanged
      .asObservable()
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((queryToFilter) => {
        this.loadCurrencyExchanges(queryToFilter);
      });
    this.isAuthenticated = authService.isAuthenticated();
  }

  currencyExchangeForm!: FormGroup;
  currencyExchange!: CurrencyExchange;
  currencies: Currency[] = [];

  //  filteredCurrencyExchanges: CurrencyExchange[] = [];
  //filteredEntries: CurrencyExchange[] = [];
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
  caption: string = 'Submit';

  // paging para
  defaultPageIndex = 0;
  defaultPageSize = 10;
  defaultSortColumn: string = 'exchangeDate';
  defaultSortOrder: 'desc' | 'asc' = 'asc';

  defaultFilterColumn: string = 'exchangeDate';
  filterQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // debouncing
  filterChanged = new BehaviorSubject<string>('');
  //

  baseCurr!: boolean;
  quoteCurr!: boolean;
  currRate!: number;

  placeholder: string = 'filter.....';

  ngOnInit() {
    this.currencyExchangeForm = this.fb.group({
      baseCurrency: ['', Validators.compose([Validators.required])],
      quoteCurrency: ['', Validators.compose([Validators.required])],
      rate: [0, Validators.compose([Validators.required])],
      exchangeDate: [
        new Date().getDate(),
        Validators.compose([Validators.required]),
      ],
    });

    this.currencyExchange = this.currencyExchangeForm.value;
    //   this.loadCurrencies();
    this.loadCurrencyExchanges(this.filterQuery);
  }

  loadCurrencies() {
    this.currencyService
      .getCurrencies(1, 9999, 'name', 'asc', '', '')
      .subscribe((response) => {
        this.currencies = response.items;
      });
  }

  loadCurrencyExchanges(filter: string) {
    const pageEvent = this.applyParams();
    this.filterQuery = filter!;
    this.getCurrencyExchanges(pageEvent);
  }

  applyParams(): PageEvent {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = APPAREL_PRO_UI_PARAMS.paging.pageIndex;
    pageEvent.pageSize = APPAREL_PRO_UI_PARAMS.paging.pageSize;
    return pageEvent;
  }

  getCurrencyExchanges(event: PageEvent) {
    const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;

    const sortOrder = this.sort
      ? this.sort.direction
      : (APPAREL_PRO_UI_PARAMS.sorting.defaultSortOrder = 'asc');

    const filterColumn = this.filterQuery ? this.defaultFilterColumn : '';

    const filterQuery = this.filterQuery ? this.filterQuery : '';

    this.currencyExchangeService
      .getCurrencyExchanges(
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
          this.currencyExchanges = new MatTableDataSource(res.items);
          console.log(res);
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

  radioChange($event: MatRadioChange) {
    console.log($event.value);
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }
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

  addCurrencyExchange(currencyExchange: CurrencyExchange) {
    // console.log(
    //   'toDateString : ',
    //   currencyExchange.exchangeDate.toDateString()
    // );
    // console.log(
    //   'toLocaleDateString : ',
    //   currencyExchange.exchangeDate.toLocaleDateString()
    // );
    // console.log('toISOString : ', currencyExchange.exchangeDate.toISOString());
    // console.log('toJSON : ', currencyExchange.exchangeDate.toJSON());
    // console.log(
    //   'toLocaleString : ',
    //   currencyExchange.exchangeDate.toLocaleString()
    // );
    // console.log(
    //   'toLocaleTimeString : ',
    //   currencyExchange.exchangeDate.toLocaleTimeString()
    // );

    const localDate = currencyExchange.exchangeDate.toLocaleDateString();
    const convertedDate = this.convertStringToDateObject(localDate);
    currencyExchange.exchangeDate = convertedDate;
    //console.log('convertStringToDateObject : ', convertedDate);

    this.currencyExchangeService
      .addCurrencyExchange(currencyExchange)
      .subscribe({
        next: (currency) => () => {},
        error: (err) => {
          const error: string = err.error;
          // this.subscribedMessage.next(error);
          // this.errorHandlerService.handleError(err);
          // this.isSubscribed.next(true);
        },
        complete: () => {
          //  this.loadCurrencyExchanges();
          // this.toastrService.success(
          //   `Currency added Successfully, ${currency.code}`
          // );
          this.currencyExchangeForm.reset();
        },
      });
  }

  onCancel(event: Event) {}
  onPageClick(data: any) {
    //  console.log('onPageClick : ', data.filteredEntries);
    //   this.filteredEntries = data.filteredEntries;
  }

  onEdit(baseCurrency: string) {
    //  this.currencyExchangeService.
    console.log(this.currencyExchange);
  }

  onUpdate() {}

  onDelete(baseCurrency: string) {}

  Isrequired() {
    return 'class-is-invalid:this.currencyExchange.baseCurrency && this.currencyExchange.quoteCurrency';
  }

  showMe(event: Event) {
    const ele = event.target as HTMLInputElement;
    ele.focus();
  }
}
