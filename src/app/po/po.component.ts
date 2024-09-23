import { Component, Inject } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { PO_SERVICE_PLUGIN } from '../tokens/tokenConfig';
import { InjectorService } from '../Services/InjectorService';
import { DialogComponent } from '../misc/dialog/dialog.component';
import { basetable } from '../common/basetable';
import { PurchaseOrder } from '../Models/OrderManagement/PurchaseOrder';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { PoFormComponent } from './po-form.component';
import { Buyer } from '../Models/References/Buyer';
import { BuyerService } from '../Services/buyer.service';
import { DatePipe } from '@angular/common';
import { GarmentTypeService } from '../Services/garmentTypeService';
import { GarmentType } from '../Models/References/GarmentType';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { StyleDetailsComponent } from '../order-management/style-details/style-details.component';
import { left } from '@popperjs/core';
import { ApparelProDialog } from '../common/apparel-pro-dialog';

@Component({
  selector: 'app-po',
  standalone: true,
  imports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioButton,
    MatTable,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './po.component.html',
  styleUrl: './po.component.css',
})
export class PoComponent extends basetable<PurchaseOrder> {
  constructor(
    @Inject(PO_SERVICE_PLUGIN) service: InjectorService<PurchaseOrder>,
    private toastrService: ToastrService,
    private buyerService: BuyerService,
    private garmentTypeService: GarmentTypeService,
    @Inject('defaultSortColumn')
    defaultSortCol: string,
    dialog: MatDialogRef<DialogComponent, PoFormComponent>
  ) {
    super(service, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
    this.defaultSortColumn = 'buyerCode';
    this.filterChanged
      .asObservable()
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((queryToFilter) => {
        this.loadEntries(queryToFilter);
      });
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;
  override filterChanged: BehaviorSubject<string> = this.filterChanged;
  override entries!: MatTableDataSource<PurchaseOrder, MatPaginator>;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override columnsToDisplay: string[] = [
    'buyer',
    'order',
    'orderDate',
    'garmentTypeName',
    'countryCode',
    'unitCode',
    'totalQuantity',
    'currencyCode',
    'season',
    'basisCode',
    'basisValue',
  ];
  garmentTypes: any;
  pos = new MatTableDataSource<PurchaseOrder, MatPaginator>();

  getPos() {
    this.garmentTypeService
      .getEntries(0, 9999, 'typeName', 'asc', '', '')
      .subscribe((res) => {
        this.garmentTypes = res.items;
        //this.garmentTypes = Array.from(res.items);
      });
    console.log('garment types : ', this.garmentTypes);

    this.service
      .getEntries(
        this.defaultPageIndex,
        this.defaultPageSize,
        this.defaultSortColumn,
        this.defaultSortOrder,
        this.defaultFilterColumn,
        this.filterQuery
      )
      .subscribe((res: { items: PurchaseOrder[] }) => {
        // res.items.map((i) => {
        //   var e = this.garmentTypes.find((gt) => gt.id === i.garmentType);
        //   console.log('before : ', i);
        //   i.garmentTypeName = e?.typeName!;
        //   console.log(i);
        // });
        this.pos = new MatTableDataSource(res.items);
      });
  }

  buyers: Buyer[] = [];

  ngOnInit() {
    this.garmentTypeService
      .getEntries(0, 9999, 'typeName', 'asc', '', '')
      .subscribe((res) => {
        this.garmentTypes = res.items;
      });
    console.log('garment types : ', this.garmentTypes);
    // var;
    var list = this.loadEntries(this.filterQuery);
    console.log('list', list);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  override editEntry(PurchaseOrder: PurchaseOrder): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '600px';
    dialogConfig.width = '750px';
    dialogConfig.panelClass = 'shadow-effects';
    dialogConfig.data = { PurchaseOrder: PurchaseOrder };
    dialogConfig.position = {
      left: `${window.screenX + 1200 / 2}px`,
      top: `${window.screenY + 1200 / 4}px`,
    };

    this.dialog
      .open(
        StyleDetailsComponent,
        dialogConfig
        //   width: '70vw',
        //   // position: {
        //   //   left: `${50}px`,
        //   //   top: `${window.screenY + 50}px`,
        //   // },
        //   data: { PurchaseOrder: PurchaseOrder },
        // })
      )
      .afterClosed()
      .subscribe(() => {
        this.loadEntries(this.filterQuery);
        //  this.toastrService.success(`country updated  Successfully, ${res}`);
      });
  }
}
