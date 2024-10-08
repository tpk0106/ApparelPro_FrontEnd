import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatRadioChange } from '@angular/material/radio';
import { DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { basetable } from '../../../common/basetable';
import { InjectorService } from '../../../Services/InjectorService';
import { Buyer } from '../../../Models/References/Buyer';
import { BuyerService } from '../../../Services/buyer.service';
import { ApparelProDialog } from '../../../common/apparel-pro-dialog';
import { BUYER_SERVICE_PLUGIN } from '../../../tokens/tokenConfig';
import { BuyerFormComponent } from './buyer-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-buyer-table',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatPaginator,
    DatePipe,
    MatTabsModule,
    MatDialogActions,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './buyer-table.component.html',
  styleUrl: './buyer-table.component.css',
})
export class BuyerTableComponent extends basetable<Buyer> {
  constructor(
    @Inject(BUYER_SERVICE_PLUGIN) service: InjectorService<Buyer>,
    private toastrService: ToastrService,
    @Inject('defaultSortColumn') defaultSortCol: string,
    private buyerService: BuyerService,
    @Inject(MAT_DIALOG_DATA)
    public data: { model: Buyer },
    //dialog: MatDialogRef<DialogComponent>
    private dialogRef: MatDialogRef<BuyerTableComponent>
  ) {
    super(service, defaultSortCol, Inject(ApparelProDialog));
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultSortColumn: string = this.defaultSortColumn;
  override filterChanged: BehaviorSubject<string> = this.filterChanged;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;

  override columnsToDisplay: string[] = [
    'buyerCode',
    'status',
    'addressId',
    'telephoneNos',
    'mobileNos',
    'fax',
    'cusdec',
    'action',
  ];

  buyers = new MatTableDataSource<Buyer, MatPaginator>();
  newBuyer!: Buyer;
  buyer: number = 0;

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {}

  override editEntry(buyer: Buyer): void {
    // const styleDetailsDialogConfig = new MatDialogConfig();
    // styleDetailsDialogConfig.height = '600px';
    // styleDetailsDialogConfig.width = '750px';
    // styleDetailsDialogConfig.hasBackdrop = true;
    // styleDetailsDialogConfig.backdropClass = ['backdrop'];
    // styleDetailsDialogConfig.panelClass = ['shadow-effects', 'dialog-color'];
    // styleDetailsDialogConfig.data = { model: style };

    this.baseTableDialogConfig.height = '840px';
    this.baseTableDialogConfig.width = '950px';
    this.baseTableDialogConfig.data = { model: buyer };

    this.dialog
      .open(BuyerFormComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe(() => {
        //super.loadEntries(this.filterQuery);
        this.loadEntries(this.filterQuery);
      });
  }

  override addEntry(entry: Buyer): void {
    if (entry == null) {
      entry = <Buyer>{};
    }

    // this.appDialog.dialogRef.addPanelClass(['shadow-effects', 'dialog-color']);
    //const ref = this.appDialog;

    //const styleDetailsDialogConfig = Inject(ApparelProDialog);

    // const styleDetailsDialogConfig = new MatDialogConfig();
    // styleDetailsDialogConfig.height = '600px';
    // styleDetailsDialogConfig.width = '350px';
    // styleDetailsDialogConfig.backdropClass = ['backdrop'];
    // styleDetailsDialogConfig.panelClass = ['custom-dialog-color'];
    // styleDetailsDialogConfig.data = { model: entry };

    this.baseTableDialogConfig.height = '840px';
    this.baseTableDialogConfig.width = '950px';
    this.baseTableDialogConfig.data = { model: entry };

    // styleDetailsDialogConfig.position = {
    //   left: `${window.screenX + 300 / 2}px`,
    //   top: `${window.screenY + 300 / 2}px`,
    // };
    this.dialog
      .open(BuyerFormComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.toastrService.success(`Buyer,  added  Successfully`);
        super.loadEntries(this.filterQuery);
      });
  }

  deleteBuyer(buyer: Buyer) {
    super.deleteEntry(buyer).subscribe({
      next: (res) => {
        this.toastrService.success(`Style, deleted  Successfully`);
        super.loadEntries(this.filterQuery);
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
