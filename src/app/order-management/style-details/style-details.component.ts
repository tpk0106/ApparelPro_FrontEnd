import { Component, inject, Inject, model } from '@angular/core';
import { basetable } from '../../common/basetable';
import { Style } from '../../Models/OrderManagement/Style';
import { InjectorService } from '../../Services/InjectorService';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatRadioChange } from '@angular/material/radio';
import { StyleDetailsFormComponent } from './style-details-form.component';
import { STYLE_DETAILS_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { APPAREL_PRO_UI_PARAMS, SORT_ORDER } from '../../misc/paramsConfig';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';

import { StyleDetailsService } from '../../Services/OrderManagement/style-details.service';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-style-details',
  standalone: true,
  imports: [AngularMaterialModule, MatPaginator, DatePipe, MatTabsModule],
  templateUrl: './style-details.component.html',
  styleUrl: './style-details.component.css',
})
export class StyleDetailsComponent extends basetable<Style> {
  constructor(
    @Inject(STYLE_DETAILS_SERVICE_PLUGIN) service: InjectorService<Style>,
    private toastrService: ToastrService,
    @Inject(SORT_ORDER) defaultSortCol: string,
    private styleDetailsService: StyleDetailsService,
    @Inject(MAT_DIALOG_DATA)
    public data: { model: Style },
    //dialog: MatDialogRef<DialogComponent>
    private dialogRef: MatDialogRef<StyleDetailsComponent>
  ) {
    super(service, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
    const style: any = { ...data };
    this.buyer = style.PurchaseOrder.buyerCode;
    this.order = style.PurchaseOrder.order;

    // this.myDialog = ApparelProDialog;

    //console.log('inside constructor : ', { ...data });
  }

  override applyParams(): PageEvent {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = APPAREL_PRO_UI_PARAMS.paging.pageIndex;
    pageEvent.pageSize = 2; //APPAREL_PRO_UI_PARAMS.paging.pageSize;
    return pageEvent;
  }

  // override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = 2;
  //override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;
  //override filterChanged: BehaviorSubject<string> = this.filterChanged;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override columnsToDisplay: string[] = [
    'type',
    'styleCode',
    'unit',
    'quantity',
    'unitPrice',
    'action',
  ];

  styleDetails = new MatTableDataSource<Style, MatPaginator>();
  add: boolean = false;
  newStyle!: Style;
  buyer: number = 0;
  order!: string;

  override getEntries(event: PageEvent): void {
    // const sortColumn = this.sort ? this.sort.active : this.defaultSortColumn;
    //  : APPAREL_PRO_UI_PARAMS.sorting.defaultSortColumn;

    // const sortOrder = this.sort
    //   ? this.sort.direction
    //   : (APPAREL_PRO_UI_PARAMS.sorting.defaultSortOrder = 'asc');

    // const filterColumn = this.filterQuery ? this.defaultFilterColumn : '';
    // const filterQuery = this.filterQuery ? this.filterQuery : '';

    this.getStylesByBuyerOrder(
      this.buyer,
      this.order,
      event.pageIndex,
      event.pageSize,
      this.defaultSortColumn,
      this.defaultSortOrder,
      this.defaultFilterColumn,
      this.filterQuery
    );
  }

  //override filterQuery: string = '';

  override loadEntries(filter: string): void {
    //const pageEvent = this.applyParams();
    // this.filterQuery = filter!;
    //this.getEntries(pageEvent);
    this.getEntries(this.applyParams());
    //console.log('style details in LoadEntries : ', this.styleDetails.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {
    // super.loadEntries(this.filterQuery);
    //console.log('loaded model', this.data.model);
    // this.styleDetailsService
    //   .getStyleDetailsByBuyerAndOrder(this.buyer, this.order)
    //   .subscribe((res: { items: Style[] }) => {
    //     this.styleDetails = new MatTableDataSource(res.items);
    //   });
    //console.log('style details OnInit: ', this.styleDetails.data);
  }
  //  override dialog = Inject(Dialog);

  //apDialog = Inject(Dialog);

  getStylesByBuyerOrder(
    buyer: number,
    order: string,
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ) {
    this.styleDetailsService
      .getStyleDetailsByBuyerAndOrder(
        buyer,
        order,
        pageIndex,
        pageSize,
        sortColumn,
        sortOrder,
        filterColumn,
        filterQuery
      )
      .subscribe((res) => {
        //.subscribe((res: { items: Style[] }) => {
        //  this.styleDetails = new MatTableDataSource(res.items);
        this.paginator.pageIndex = res.currentPage;
        this.paginator.pageSize = res.pageSize;
        this.paginator.length = res.totalItems;
        this.entries = new MatTableDataSource(res.items);
      });
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  override editEntry(style: Style): void {
    // const styleDetailsDialogConfig = new MatDialogConfig();
    // styleDetailsDialogConfig.height = '600px';
    // styleDetailsDialogConfig.width = '750px';
    // styleDetailsDialogConfig.hasBackdrop = true;
    // styleDetailsDialogConfig.backdropClass = ['backdrop'];
    // styleDetailsDialogConfig.panelClass = ['shadow-effects', 'dialog-color'];
    // styleDetailsDialogConfig.data = { model: style };

    this.baseTableDialogConfig.height = '600px';
    this.baseTableDialogConfig.width = '300px';
    this.baseTableDialogConfig.data = { model: style };

    this.dialog
      .open(StyleDetailsFormComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe(() => {
        //super.loadEntries(this.filterQuery);
        this.loadEntries(this.filterQuery);
      });
  }

  override addEntry(entry: Style): void {
    if (entry == null) {
      entry = <Style>{};
    }
    entry.buyerCode = this.buyer;
    entry.order = this.order;
    entry.id = 0;

    // this.appDialog.dialogRef.addPanelClass(['shadow-effects', 'dialog-color']);
    //const ref = this.appDialog;

    //const styleDetailsDialogConfig = Inject(ApparelProDialog);

    // const styleDetailsDialogConfig = new MatDialogConfig();
    // styleDetailsDialogConfig.height = '600px';
    // styleDetailsDialogConfig.width = '350px';
    // styleDetailsDialogConfig.backdropClass = ['backdrop'];
    // styleDetailsDialogConfig.panelClass = ['custom-dialog-color'];
    // styleDetailsDialogConfig.data = { model: entry };

    this.baseTableDialogConfig.height = '600px';
    this.baseTableDialogConfig.width = '300px';
    this.baseTableDialogConfig.data = { model: entry };

    // styleDetailsDialogConfig.position = {
    //   left: `${window.screenX + 300 / 2}px`,
    //   top: `${window.screenY + 300 / 2}px`,
    // };
    this.dialog
      .open(StyleDetailsFormComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.toastrService.success(
          `Style, ${entry.styleCode} added  Successfully`
        );
        // super.loadEntries(this.filterQuery);
      });
  }

  deleteStyleDetails(Style: Style) {
    super.deleteEntry(Style).subscribe({
      next: (res) => {
        this.toastrService.success(`Style, deleted  Successfully`);
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
