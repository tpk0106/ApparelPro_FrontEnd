import { Component, Inject } from '@angular/core';
import { Address } from '../../Models/References/Address';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ADDRESS_SERVICE_PLUGIN,
  UNIT_SERVICE_PLUGIN,
} from '../../tokens/tokenConfig';
import { InjectorService } from '../../Services/InjectorService';
import { ToastrService } from 'ngx-toastr';

import { AddressService } from '../../Services/address.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { baseform } from '../../common/baseform';
import { map, Observable } from 'rxjs';
import { basetable } from '../../common/basetable';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatRadioChange } from '@angular/material/radio';
import { SORT_ADDRESS } from '../../misc/paramsConfig';
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
  ],
  templateUrl: './Address-form.component.html',
  styleUrl: './Address-form.component.css',
})
export class AddressFormComponent extends baseform<Address> {
  addressForm!: FormGroup;

  fb: FormBuilder = new FormBuilder();
  override id!: number;

  countries: Country[] = [];

  constructor(
    @Inject(UNIT_SERVICE_PLUGIN) service: InjectorService<Address>,
    private toastrService: ToastrService,
    private validationService: AddressService,
    private dialogRef: MatDialogRef<AddressFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Address },
    private countryService: CountryService
  ) {
    super(service, validationService, data);
    this.addressForm = this.fb.group({
      streetAddress: [
        this.data.model.streetAddress,
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      postCode: [
        this.data.model.postCode,
        Validators.compose([Validators.required, Validators.maxLength(5)]),
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
      buyer: [
        this.data.model.buyer,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      default: [
        this.data.model.default,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      addressType: [
        this.data.model.addressType,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
    });

    //this.edit = data.model.code ? true : false;

    // if (!this.edit) this.addressForm.setAsyncValidators(this.isDuplicateUnit()); // assign validator func here
  }

  override ngOnInit(): void {
    this.id = this.data.model.id;
    this.countryService
      .getEntries(0, 9999, 'name', 'asc', '', '')
      .subscribe((res) => {
        this.countries = res.items;
      });
  }

  submitEntry(entry: Address) {
    const Address = this.id > 0 ? entry : <Address>{};
    if (Address) {
      Address.streetAddress = this.addressForm.controls['streetAddress'].value;
      Address.buyer = this.addressForm.controls['buyer'].value;
      Address.buyerCode = this.addressForm.controls['buyerCode'].value;
      Address.city = this.addressForm.controls['city'].value;
      Address.countryCode = this.addressForm.controls['countryCode'].value;
      Address.default = this.addressForm.controls['default'].value;
      Address.postCode = this.addressForm.controls['postCode'].value;
      Address.state = this.addressForm.controls['state'].value;
      Address.addressType = this.addressForm.controls['addressType'].value;
    }
    if (this.id > 0) {
      super.editEntry(Address);
    } else {
      super.addEntry(Address);
      this.toastrService.success(
        `Address: ${Address.streetAddress} updated Successfully`
      );
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  isDuplicateUnit(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      var code = this.addressForm.controls['code'].value;
      return super.isDuplicated(code).pipe(
        map((res: any) => {
          return res ? { isDuplicateUnit: true } : null;
        })
      );
    };
  }
}

// address table

@Component({
  selector: 'app-address-table',
  standalone: true,
  imports: [AngularMaterialModule, MatDialogModule, ReactiveFormsModule, NgIf],
  templateUrl: './address-table.component.html',
  styleUrl: './address-table.component.css',
})
export class AddressTableComponent extends basetable<Address> {
  constructor(
    @Inject(ADDRESS_SERVICE_PLUGIN) unitService: InjectorService<Address>,
    //  toastrService: ToastrService,
    @Inject(SORT_ADDRESS) defaultSortCol: string
  ) {
    super(unitService, defaultSortCol, Inject(ApparelProDialog));
    this.defaultSortColumn = defaultSortCol;
  }

  override defaultPageIndex: number = this.defaultPageIndex;
  override defaultPageSize: number = this.defaultPageSize;
  override defaultFilterColumn: string = this.defaultSortColumn;
  override defaultSortColumn: string = this.defaultSortOrder;

  //OPERATION: STATUS = STATUS.ADDNEW;
  newUnit!: Address;

  override columnsToDisplay: string[] = [
    'addressType',
    'streetAddress',
    'city',
    'postCode',
    'state',
    'country',
    'default',
    'buyerCode',
  ];

  addresses = new MatTableDataSource<Address, MatPaginator>();

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
      .subscribe((units: { items: Address[] }) => {
        this.addresses = new MatTableDataSource(units.items);
      });
  }

  radioChange($event: MatRadioChange) {
    this.defaultFilterColumn = $event.value;
    this.placeholder = `filter by ${$event.value} ...`;
  }

  // load entry for editing
  override editEntry(Address: Address): void {
    this.dialog
      .open(AddressFormComponent, { data: { model: Address } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }

  // load empty model for insert
  override addEntry(entry: Address): void {
    this.dialog
      .open(AddressFormComponent, { data: { model: {} } })
      .afterClosed()
      .subscribe(() => {
        super.loadEntries(this.filterQuery);
      });
  }
}
