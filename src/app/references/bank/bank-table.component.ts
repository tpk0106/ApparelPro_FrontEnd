import { Component, Inject } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { Bank } from '../../Models/References/Bank';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { InjectorService } from '../../Services/InjectorService';
import { BANK_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { DialogComponent } from '../../misc/dialog/dialog.component';
import { basetable } from '../../common/basetable';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { BankFormComponent } from './bank-form.component';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';

@Component({
  selector: 'app-bank-table',
  standalone: true,
  imports: [AngularMaterialModule, MatPaginator],
  templateUrl: './bank-table.component.html',
  styleUrl: './bank-table.component.css',
})
export class BankTableComponent extends basetable<Bank> {
  constructor(
    @Inject(BANK_SERVICE_PLUGIN) service: InjectorService<Bank>,
    private toastrService: ToastrService,
    @Inject('defaultSortColumn') defaultSortCol: string
    //  dialog: MatDialogRef<DialogComponent>
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
    'bankCode',
    'name',
    'telephoneNos',
    'swiftCode',
    'loanLimit',
    'currency',
    'action',
  ];

  banks = new MatTableDataSource<Bank, MatPaginator>();
  add: boolean = false;
  newBank!: Bank;

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
      .subscribe((res: { items: Bank[] }) => {
        this.banks = new MatTableDataSource(res.items);
      });
  }

  ngOnInit() {
    super.loadEntries(this.filterQuery);
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  override editEntry(Bank: Bank): void {
    console.log('dialog opening');

    this.dialog
      .open(BankFormComponent, {
        width: '70vw',

        panelClass: 'shadow-effects',
        backdropClass: 'Modal__overlay',
        data: { model: Bank },
      })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
        //  this.toastrService.success(`Bank updated  Successfully, ${res}`);
      });
  }

  override addEntry(entry: Bank): void {
    this.dialog
      .open(BankFormComponent, { data: { model: {} } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  deleteCountry(Bank: Bank) {
    super.deleteEntry(Bank).subscribe({
      next: (res) => {
        this.toastrService.success(`Bank, deleted  Successfully`);
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
