import { Component, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { basetable } from '../../common/basetable';
import { MatPaginator } from '@angular/material/paginator';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BehaviorSubject } from 'rxjs';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../misc/dialog/dialog.component';

import { InjectorService } from '../../Services/InjectorService';
import { CURRENCY_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { Currency } from '../../Models/References/Currency';
import { CurrencyFormComponent } from './currency-form.component';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { MatDividerModule } from '@angular/material/divider';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';

@Component({
  selector: 'app-currency-table',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatRadioButton,
    MatRadioGroup,
    MatPaginator,
    MatDividerModule,
  ],
  templateUrl: './currency-table.component.html',
  styleUrl: './currency-table.component.css',
})
export class CurrencyTableComponent extends basetable<Currency> {
  constructor(
    @Inject(CURRENCY_SERVICE_PLUGIN) service: InjectorService<Currency>,
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
    'code',
    'name',
    'countryCode',
    'country',
    'action',
  ];

  newCurrency!: Currency;

  currencies = new MatTableDataSource<Currency, MatPaginator>();

  getCurrencies() {
    this.service
      .getEntries(
        this.defaultPageIndex,
        this.defaultPageSize,
        this.defaultSortColumn,
        this.defaultSortOrder,
        this.defaultFilterColumn,
        this.filterQuery
      )
      .subscribe((res: { items: Currency[] }) => {
        this.currencies = new MatTableDataSource(res.items);
      });
  }

  ngOnInit() {
    super.loadEntries(this.filterQuery);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  override editEntry(currency: Currency): void {
    //   console.log('loaded curr: ', currency);
    const currencyDialogConfig = new MatDialogConfig();
    currencyDialogConfig.height = '500px';
    currencyDialogConfig.width = '350px';
    currencyDialogConfig.backdropClass = ['backdrop'];
    currencyDialogConfig.panelClass = ['custom-dialog-color'];
    currencyDialogConfig.data = { model: currency };

    this.dialog
      .open(CurrencyFormComponent, currencyDialogConfig)
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  // load empty model for insert
  override addEntry(eurrency: Currency): void {
    this.baseTableDialogConfig.height = '600px';
    this.baseTableDialogConfig.width = '300px';
    this.baseTableDialogConfig.data = { model: {} };
    this.dialog
      .open(CurrencyFormComponent, { data: { model: {} } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  deleteCurrency(currency: Currency) {
    super.deleteEntry(currency).subscribe({
      next: (res) => {
        this.toastrService.success(`currency, deleted  Successfully`);
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
}
