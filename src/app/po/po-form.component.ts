import { Component, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { POService } from '../Services/OrderManagement/POService';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../misc/error-handler.service';
import { ActivatedRoute } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { PurchaseOrder } from '../Models/OrderManagement/PurchaseOrder';
import { Buyer } from '../Models/References/Buyer';
import { BuyerService } from '../Services/buyer.service';
import { Country } from '../Models/References/Country';
import { CountryService } from '../Services/countryService';
import { PaginationAPIModel } from '../Models/ApiResult';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { UnitService } from '../Services/unit.service';
import { GarmentTypeService } from '../Services/garmentTypeService';
import { CurrencyService } from '../Services/currencyService';
import { BasisService } from '../Services/basis.service';
@Component({
  selector: 'app-po-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    MatDialogActions,
    MatDialogContent,
    CalendarModule,
    MatDatepickerModule,
    MatDatepicker,
    NgbDatepicker,
  ],
  templateUrl: './po-form.component.html',
  styleUrl: './po-form.component.css',
})
export class PoFormComponent {
  poForm!: FormGroup;
  id: number = 0;

  orderDate!: string;
  filterQuery: string = '';
  PurchaseOrder!: PurchaseOrder;

  // paging para
  defaultPageIndex = 0;
  defaultPageSize = 10;
  defaultSortColumn: string = 'name';
  defaultSortOrder: 'desc' | 'asc' = 'asc';

  defaultFilterColumn: string = 'name';
  caption: string = 'Submit';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pos: MatTableDataSource<PurchaseOrder> = new MatTableDataSource();
  //buyers: MatTableDataSource<Buyer> = new MatTableDataSource();

  buyers: Buyer[] = [];
  countries: any;
  units: any;
  garmentTypes: any;
  currencies: any;
  basises: any;

  constructor(
    private fb: FormBuilder,
    private poService: POService,
    private buyerService: BuyerService,
    private countryService: CountryService,
    private unitService: UnitService,
    private garmentTypeService: GarmentTypeService,
    private currencyService: CurrencyService,
    private basisService: BasisService,
    private toastrService: ToastrService,
    private errorHandlerService: ErrorHandlerService,
    // private authService: AuthenticationService,
    private dialogRef: MatDialogRef<PoFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { PurchaseOrder: PurchaseOrder }
  ) {}

  ngOnInit() {
    // this.buyerService.getBuyers().subscribe((res) => {
    //   this.buyers = res;
    // });
    this.buyerService
      .getEntries(0, 9999, 'name', 'asc', '', '')
      .subscribe((res) => {
        this.buyers = res.items;
      });
    this.countryService
      .getEntries(0, 9999, 'name', 'asc', '', '')
      .subscribe((res) => {
        this.countries = res.items;
      });
    this.unitService
      .getEntries(0, 9999, 'code', 'asc', '', '')
      .subscribe((res) => {
        this.units = res.items;
      });

    this.garmentTypeService
      .getEntries(0, 9999, 'typeName', 'asc', '', '')
      .subscribe((res) => {
        this.garmentTypes = res.items;
      });

    this.currencyService
      .getEntries(0, 9999, 'code', 'asc', '', '')
      .subscribe((res) => {
        this.currencies = res.items;
      });

    this.basisService
      .getEntries(0, 9999, 'code', 'asc', '', '')
      .subscribe((res) => {
        this.basises = res.items;
      });
    console.log('basises : ', this.basises);

    this.poForm = this.fb.group({
      order: [
        this.data.PurchaseOrder.order,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      orderDate: [
        this.data.PurchaseOrder.orderDate,
        Validators.compose([Validators.required]),
      ],
      garmentType: [
        this.data.PurchaseOrder.garmentType,
        Validators.compose([Validators.required]),
      ],
      countryCode: [
        this.data.PurchaseOrder.countryCode,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      code: [
        this.data.PurchaseOrder.unitCode,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      totalQuantity: [
        this.data.PurchaseOrder.totalQuantity,
        Validators.compose([Validators.required]),
      ],
      currencyCode: [
        this.data.PurchaseOrder.currencyCode,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      season: [
        this.data.PurchaseOrder.season,
        Validators.compose([Validators.required]),
      ],
      basisCode: [
        this.data.PurchaseOrder.basisCode,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      basisValue: [
        this.data.PurchaseOrder.basisValue,
        Validators.compose([Validators.required]),
      ],
    });

    this.PurchaseOrder = this.poForm.value;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateCountry() {
    const PurchaseOrder = this.id > 0 ? this.PurchaseOrder : <PurchaseOrder>{};
    if (PurchaseOrder) {
      PurchaseOrder.order = this.poForm.controls['order'].value;
      PurchaseOrder.orderDate = this.poForm.controls['orderDate'].value;
      PurchaseOrder.garmentType = this.poForm.controls['garmentType'].value;
      PurchaseOrder.countryCode = this.poForm.controls['countryCode'].value;
      PurchaseOrder.unitCode = this.poForm.controls['unitCode'].value;
      PurchaseOrder.totalQuantity = this.poForm.controls['totalQuantity'].value;
      PurchaseOrder.currencyCode = this.poForm.controls['currencyCode'].value;
      PurchaseOrder.season = this.poForm.controls['season'].value;
      PurchaseOrder.basisCode = this.poForm.controls['basisCode'].value;
      PurchaseOrder.basisValue = this.poForm.controls['basisValue'].value;
    }

    return this.poService
      .UpdatePO(PurchaseOrder.buyerCode, PurchaseOrder.order, PurchaseOrder)
      .subscribe({
        next: () => () => {},
        error: (err: { error: string }) => {
          const error: string = err.error;
          // this.subscribedMessage.next(error);
          this.errorHandlerService.handleError(err);
          // this.isSubscribed.next(true);
        },
        complete: () => {
          this.toastrService.success(
            `PurchaseOrder updated Successfully, ${PurchaseOrder.order}`
          );
          this.dialogRef.close();
        },
      });
  }

  imageDataUrl(data: any): string {
    const url: string = 'data:image/jpeg;base64,' + data;
    return url;
  }
}
