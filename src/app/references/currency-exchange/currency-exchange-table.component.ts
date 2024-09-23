import { Component, Inject } from '@angular/core';
import { CurrencyExchange } from '../../Models/References/CurrencyExchange';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../utilities/button/button.component';
import { NgFor, NgIf } from '@angular/common';
//import { PageComponent } from '../../paging/page/page.component';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { SORT_QUOTE_CURRENCY } from '../../misc/paramsConfig';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { basetable } from '../../common/basetable';
import { InjectorService } from '../../Services/InjectorService';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../misc/dialog/dialog.component';
import { CurrencyExchangeFormComponent } from './currency-exchange-form.component';
import { CURRENCY_EXCHANGE_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { ToastrService } from 'ngx-toastr';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';

@Component({
  selector: 'app-currency-exchange-table',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    NgIf,
    NgFor,
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
  templateUrl: './currency-exchange-table.component.html',
  styleUrl: './currency-exchange-table.component.css',
})
export class CurrencyExchangeTableComponent extends basetable<CurrencyExchange> {
  constructor(
    @Inject(CURRENCY_EXCHANGE_SERVICE_PLUGIN)
    service: InjectorService<CurrencyExchange>,
    private toastrService: ToastrService,
    @Inject(SORT_QUOTE_CURRENCY) defaultSortCol: string,
    dialog: MatDialogRef<DialogComponent>
  ) {
    super(service, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
    this.filterChanged
      .asObservable()
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((queryToFilter) => {
        super.loadEntries(queryToFilter);
      });
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;
  override filterChanged: BehaviorSubject<string> = this.filterChanged;
  override entries!: MatTableDataSource<CurrencyExchange, MatPaginator>;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override columnsToDisplay: string[] = [
    'baseCurrency',
    'rate',
    'quoteCurrency',
    'exchangeDate',
  ];

  currencyExchanges = new MatTableDataSource<CurrencyExchange, MatPaginator>();

  getCurrencyExchanges() {
    this.service
      .getEntries(
        this.defaultPageIndex,
        this.defaultPageSize,
        this.defaultSortColumn,
        this.defaultSortOrder,
        this.defaultFilterColumn,
        this.filterQuery
      )
      .subscribe((res: { items: CurrencyExchange[] }) => {
        this.currencyExchanges = new MatTableDataSource(res.items);
      });
  }

  ngOnInit() {
    super.loadEntries(this.filterQuery);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  override editEntry(currencyExchange: CurrencyExchange): void {
    this.dialog
      .open(CurrencyExchangeFormComponent, {
        data: { model: currencyExchange },
      })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }
}
