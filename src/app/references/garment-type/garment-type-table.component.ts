import { Component, Inject } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { basetable } from '../../common/basetable';

import { MatPaginator } from '@angular/material/paginator';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../misc/dialog/dialog.component';

import { SORT_GARMENT_TYPE } from '../../misc/paramsConfig';
import { GarmentType } from '../../Models/References/GarmentType';
import { GarmentTypeFormComponent } from '../garment-type/garment-type-form.component';

import { GARMENT_TYPE_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { InjectorService } from '../../Services/InjectorService';

import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';

@Component({
  selector: 'app-garment-type-table',
  standalone: true,
  imports: [AngularMaterialModule, MatRadioButton, MatRadioGroup, MatPaginator],
  //providers: [IService<GarmentType> , IService: GarmentTypeService],
  templateUrl: './garment-type-table.component.html',
  styleUrl: './garment-type-table.component.css',
})
export class GarmentTypeTableComponent extends basetable<GarmentType> {
  constructor(
    @Inject(GARMENT_TYPE_SERVICE_PLUGIN) service: InjectorService<GarmentType>,
    private toastrService: ToastrService,
    @Inject(SORT_GARMENT_TYPE)
    defaultSortCol: string,
    dialog: MatDialogRef<DialogComponent, GarmentTypeFormComponent>
  ) {
    super(service, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
    // service = @Inject(GarmentTypeService)
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;
  override filterChanged: BehaviorSubject<string> = this.filterChanged;
  override entries!: MatTableDataSource<GarmentType, MatPaginator>;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override columnsToDisplay: string[] = ['typeName'];

  garmentTypes = new MatTableDataSource<GarmentType, MatPaginator>();

  getGarmentTypes() {
    this.service
      .getEntries(
        this.defaultPageIndex,
        this.defaultPageSize,
        this.defaultSortColumn,
        this.defaultSortOrder,
        this.defaultFilterColumn,
        this.filterQuery
      )
      .subscribe((res: { items: GarmentType[] }) => {
        this.garmentTypes = new MatTableDataSource(res.items);
      });
  }

  ngOnInit() {
    super.loadEntries(this.filterQuery);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  override editEntry(garmentType: GarmentType): void {
    this.dialog
      .open(GarmentTypeFormComponent, { data: { model: garmentType } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }
}
