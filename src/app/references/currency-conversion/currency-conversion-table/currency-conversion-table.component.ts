import { Component, Inject } from '@angular/core';
import { basetable } from '../../../common/basetable';
import { CurrencyConversion } from '../../../Models/References/CurrencyConversion';
import { InjectorService } from '../../../Services/InjectorService';
import { CURRENCY_CONVERSION_SERVICE_PLUGIN } from '../../../tokens/tokenConfig';
import { CurrencyConversionFormComponent } from '../currency-conversion-form/currency-conversion-form.component';
import { DialogComponent } from '../../../misc/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { ToastrService } from 'ngx-toastr';
import { ApparelProDialog } from '../../../common/apparel-pro-dialog';

@Component({
  selector: 'app-currency-conversion-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    MatRadioButton,
    MatRadioGroup,
  ],
  templateUrl: './currency-conversion-table.component.html',
  styleUrl: './currency-conversion-table.component.css',
})
export class CurrencyConversionTableComponent extends basetable<CurrencyConversion> {
  //currencyConversions!: CurrencyConversion[];

  constructor(
    @Inject(CURRENCY_CONVERSION_SERVICE_PLUGIN)
    service: InjectorService<CurrencyConversion>,
    private toastrService: ToastrService,
    @Inject('defaultSortColumn') defaultSortCol: string,
    dialog: MatDialogRef<DialogComponent>
  ) {
    super(service, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
    this.defaultSortColumn = 'fromCurrency';
  }
  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;

  override filterChanged: BehaviorSubject<string> = this.filterChanged;
  //override entries!: MatTableDataSource<Country, MatPaginator>;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override columnsToDisplay: string[] = ['fromCurrency', 'toCurrency', 'value'];

  currencyConversions = new MatTableDataSource<
    CurrencyConversion,
    MatPaginator
  >();

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
      .subscribe((res: { items: CurrencyConversion[] }) => {
        this.currencyConversions = new MatTableDataSource(res.items);
      });
  }

  ngOnInit() {
    this.loadEntries(this.filterQuery);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }
  //override editEntry(entry: Country, component: this): void {
  override editEntry(currencyConversion: CurrencyConversion): void {
    this.dialog
      .open(CurrencyConversionFormComponent, {
        data: { currencyConversion: currencyConversion },
      })
      .afterClosed()
      .subscribe(() => {
        this.loadEntries(this.filterQuery);
        //  this.toastrService.success(`country updated  Successfully, ${res}`);
      });
  }
}
