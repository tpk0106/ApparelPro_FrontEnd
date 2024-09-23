import { Component, Inject } from '@angular/core';
import { basetable } from '../../common/basetable';
import { Unit } from '../../Models/References/Unit';
import { InjectorService } from '../../Services/InjectorService';
import { SORT_CODE } from '../../misc/paramsConfig';
import { UNIT_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

import { MatRadioChange } from '@angular/material/radio';
import { UnitFormComponent } from './unit-form.component';
import { ToastrService } from 'ngx-toastr';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';

@Component({
  selector: 'app-unit-table',
  standalone: true,
  imports: [AngularMaterialModule],
  templateUrl: './unit-table.component.html',
  styleUrl: './unit-table.component.css',
})
export class UnitTableComponent extends basetable<Unit> {
  constructor(
    @Inject(UNIT_SERVICE_PLUGIN) unitService: InjectorService<Unit>,
    //  toastrService: ToastrService,
    @Inject(SORT_CODE) defaultSortCol: string
  ) {
    super(unitService, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultFilterColumn: string = this.defaultSortColumn;
  override defaultSortColumn: string = this.defaultSortOrder;

  //OPERATION: STATUS = STATUS.ADDNEW;
  newUnit!: Unit;

  override columnsToDisplay: string[] = ['code', 'description'];

  units = new MatTableDataSource<Unit, MatPaginator>();

  ngOnInit() {
    super.loadEntries(this.filterQuery);
  }

  getUnits() {
    this.service
      .getEntries(
        this.defaultPageIndex,
        this.defaultPageSize,
        this.defaultSortColumn,
        this.defaultSortOrder,
        this.defaultFilterColumn,
        this.filterQuery
      )
      .subscribe((units: { items: Unit[] }) => {
        this.units = new MatTableDataSource(units.items);
      });
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  // load entry for editing
  override editEntry(unit: Unit): void {
    this.dialog
      .open(UnitFormComponent, { data: { model: unit } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  // load empty model for insert
  override addEntry(entry: Unit): void {
    this.dialog
      .open(UnitFormComponent, { data: { model: {} } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }
}
