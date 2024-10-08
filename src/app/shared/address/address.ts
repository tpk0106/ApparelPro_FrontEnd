import { Component, Inject, Input } from '@angular/core';
import { Address } from '../../Models/References/Address';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatRadioChange } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';

import { ADDRESS_TYPE } from '../../misc/status-info';
import { ADDRESS_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { addressType } from '../../Models/interfaces/IAddressType';
import { InjectorService } from '../../Services/InjectorService';
import { AddressService } from '../../Services/address.service';
import { baseform } from '../../common/baseform';
import { basetable } from '../../common/basetable';
import { APPAREL_PRO_UI_PARAMS, SORT_ADDRESS } from '../../misc/paramsConfig';
import { CountryService } from '../../Services/countryService';
import { Country } from '../../Models/References/Country';
import { ApparelProDialog } from '../../common/apparel-pro-dialog';

@Component({
  selector: 'app-Address-form',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
  ],
  templateUrl: './Address-form.component.html',
  styleUrl: './Address-form.component.css',
})
export class AddressFormComponent extends baseform<Address> {
  addressForm!: FormGroup;

  fb: FormBuilder = new FormBuilder();
  override id!: number;

  countries: Country[] = [];
  addressTypeList: addressType[] = [];

  address!: Address;

  buyerCode!: number;
  addressId: any;

  constructor(
    @Inject(ADDRESS_SERVICE_PLUGIN) service: InjectorService<Address>,
    private toastrService: ToastrService,
    private validationService: AddressService,
    private dialogRef: MatDialogRef<AddressFormComponent>,
    @Inject(SORT_ADDRESS) defaultSortCol: string,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Address },
    private countryService: CountryService
  ) {
    super(service, validationService, data);
    this.defaultSortColumn = defaultSortCol;

    this.addressForm = this.fb.group({
      id: [this.data.model.id],
      streetAddress: [
        this.data.model.streetAddress,
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      postCode: [
        this.data.model.postCode,
        Validators.compose([
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(/^[0-9]{3,5}$/),
        ]),
      ],
      city: [
        this.data.model.city,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      countryCode: [
        this.data.model.countryCode,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      state: [
        this.data.model.state,
        Validators.compose([Validators.required, Validators.maxLength(5)]),
      ],
      default: [this.data.model.default],
      addressType: [
        this.data.model.addressType,
        Validators.compose([Validators.required]),
      ],
    });
  }

  defaultSortColumn!: string;
  override ngOnInit(): void {
    this.buyerCode = this.data.model.buyerCode;
    this.addressId = this.data.model.addressId;

    this.id = this.data.model.id;
    this.countryService
      .getEntries(0, 9999, 'name', 'asc', '', '')
      .subscribe((res) => {
        this.countries = res.items;
      });

    this.ProcessAddressTypeList();
  }

  ProcessAddressTypeList() {
    let addresType: addressType | null = {
      key: null,
      val: null,
    };
    this.addressTypeList = [];

    for (let [key, value] of Object.entries(ADDRESS_TYPE)) {
      addresType.key = value;
      addresType.val = key;
      this.addressTypeList.push({ ...addresType });
    }
    this.addressTypeList.splice(0, 5);
  }

  radioChange($event: MatRadioChange) {
    this.data.model.default = $event.value;
    this.addressForm.patchValue({ default: $event.value });
  }

  submitEntry(entry: Address) {
    const address = this.data.model.id > 0 ? entry : <Address>{};
    if (address) {
      address.streetAddress = this.addressForm.controls['streetAddress'].value;
      address.buyerCode = this.buyerCode;
      address.addressId = this.addressId;
      address.city = this.addressForm.controls['city'].value;
      address.countryCode = this.addressForm.controls['countryCode'].value;
      address.default = this.addressForm.controls['default'].value;
      address.postCode = this.addressForm.controls['postCode'].value;
      address.state = this.addressForm.controls['state'].value;
      address.addressType = +this.addressForm.controls['addressType'].value;
    }
    if (this.id > 0) {
      super.editEntry(address).subscribe(() => {
        this.baseService.getEntries(
          APPAREL_PRO_UI_PARAMS.paging.pageIndex,
          APPAREL_PRO_UI_PARAMS.paging.pageSize,
          this.defaultSortColumn,
          'asc',
          '',
          ''
        );
        this.toastrService.success(
          `Address: ${address.streetAddress}, ${address.city} updated Successfully`
        );
      });
    } else {
      super.addEntry(address).subscribe(() => {
        this.baseService.getEntries(
          APPAREL_PRO_UI_PARAMS.paging.pageIndex,
          APPAREL_PRO_UI_PARAMS.paging.pageSize,
          this.defaultSortColumn,
          'asc',
          '',
          ''
        );
        this.toastrService.success(
          `Address: ${address.streetAddress}, ${address.city} added Successfully`
        );
      });
      // this.toastrService.success(
      //   `Address: ${address.streetAddress} updated Successfully`
      // );
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
    //this.dialogRef.close({ data: this.returnData });
  }

  isDuplicateAddress(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      // var code = this.addressForm.controls['AddressId'].value;
      // return super.isDuplicated(code).pipe(
      //   map((res: any) => {
      //     return res ? { isDuplicateAddress: true } : null;
      //   })
      // );
      return new Observable();
    };
  }
}

// address table

@Component({
  selector: 'app-address-table',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgIf,
    AddressFormComponent,
  ],
  templateUrl: './address-table.component.html',
  styleUrl: './address-table.component.css',
})
export class AddressTableComponent extends basetable<Address> {
  constructor(
    @Inject(ADDRESS_SERVICE_PLUGIN) addressService: InjectorService<Address>,
    //  toastrService: ToastrService,
    @Inject(SORT_ADDRESS) defaultSortCol: string,
    private _addressService: AddressService
  ) {
    super(addressService, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;

    this.ProcessAddressTypeList();
  }

  getAddressType(key: number): string {
    const addressType = this.addressTypeList.find((e) => e.key == key);
    return addressType!.val;
  }

  override applyParams(): PageEvent {
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = APPAREL_PRO_UI_PARAMS.paging.pageIndex;
    pageEvent.pageSize = 2; //APPAREL_PRO_UI_PARAMS.paging.pageSize;
    return pageEvent;
  }

  override defaultPageSize: number = 2;
  override defaultSortColumn: string = this.defaultSortColumn;
  override sort: MatSort = this.sort;
  override paginator: MatPaginator = this.paginator;
  override defaultPageIndex: number = this.defaultPageIndex;

  @Input() addressId: any;
  @Input() buyerCode!: number;

  newAddress!: Address;

  override columnsToDisplay: string[] = [
    'addressType',
    'streetAddress',
    'city',
    'postCode',
    'state',
    'countryCode',
    'default',
  ];

  addresses = new MatTableDataSource<Address, MatPaginator>();

  ngOnInit() {
    super.loadEntries(this.filterQuery);
  }

  override getEntries(event: PageEvent): void {
    this.getAddressesByAddressId(
      this.addressId,
      event.pageIndex,
      event.pageSize,
      this.defaultSortColumn,
      this.defaultSortOrder,
      this.defaultFilterColumn,
      this.filterQuery
    );
  }

  getAddressesByAddressId(
    addressId: any,
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string
  ) {
    this._addressService
      .getAddressesByAddressId(
        addressId,
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

  // load entry for editing
  override editEntry(address: Address): void {
    this.dialog
      .open(AddressFormComponent, { data: { model: address } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  // load empty model for insert
  override addEntry(entry: Address): void {
    entry = <Address>{};

    entry.buyerCode = this.buyerCode;
    entry.addressId = this.addressId;
    entry.id = 0;

    this.baseTableDialogConfig.height = '700px';
    this.baseTableDialogConfig.width = '350px';
    this.baseTableDialogConfig.data = { model: entry };
    this.dialog
      .open(AddressFormComponent, this.baseTableDialogConfig)
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  addressTypeList: addressType[] = [];

  ProcessAddressTypeList() {
    let addresType: addressType | null = {
      key: null,
      val: null,
    };
    this.addressTypeList = [];

    for (let [key, value] of Object.entries(ADDRESS_TYPE)) {
      addresType.key = value;
      addresType.val = key;
      this.addressTypeList.push({ ...addresType });
    }
    this.addressTypeList.splice(0, 5);
  }
}
