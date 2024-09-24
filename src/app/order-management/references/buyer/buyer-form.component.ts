import { Component, Inject, signal } from '@angular/core';
import { baseform } from '../../../common/baseform';
import { Buyer } from '../../../Models/References/Buyer';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {
  ADDRESS_SERVICE_PLUGIN,
  BUYER_SERVICE_PLUGIN,
} from '../../../tokens/tokenConfig';
import { InjectorService } from '../../../Services/InjectorService';
import { ToastrService } from 'ngx-toastr';
import { BuyerService } from '../../../Services/buyer.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { NgIf, NgFor } from '@angular/common';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { Address } from '../../../Models/References/Address';
import { AddressService } from '../../../Services/address.service';
import { basetable } from '../../../common/basetable';
import { AddressTableComponent } from '../../../shared/address/address';
import { MatCard, MatCardContent } from '@angular/material/card';
import { APPAREL_PRO_UI_PARAMS } from '../../../misc/paramsConfig';
import { BUYER_STATUS } from '../../../misc/status-info';
import { publishFacade } from '@angular/compiler';
interface st {
  key: any;
  val: any;
}
@Component({
  selector: 'app-buyer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    MatDialogActions,
    MatDialogContent,
    NgIf,
    NgFor,
    MatDividerModule,
    AddressTableComponent,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './buyer-form.component.html',
  styleUrl: './buyer-form.component.css',
})
export class BuyerFormComponent extends baseform<Buyer> {
  buyerForm!: FormGroup;
  fb: FormBuilder = new FormBuilder();
  override id!: number;

  addresses: Address[] = [];

  //@Inject(ADDRESS_SERVICE_PLUGIN) addressService: AddressService | undefined;

  protected readonly value = signal('');

  statusList: st[] = [];

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  filterQuery: string = '';
  buyer!: Buyer;
  address!: Address;

  //public BUYER_STATUS = BUYER_STATUS;

  changes = new BehaviorSubject<any>('').asObservable;

  countries: MatTableDataSource<Buyer> = new MatTableDataSource();

  constructor(
    @Inject(BUYER_SERVICE_PLUGIN) buyerService: InjectorService<Buyer>,
    private toastrService: ToastrService,
    private validationService: BuyerService,
    private dialogRef: MatDialogRef<BuyerFormComponent>,
    @Inject('defaultSortColumn') defaultSortCol: string,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Buyer } // private addressService: AddressService
  ) {
    super(buyerService, validationService, data);
    this.defaultSortColumn = defaultSortCol;
    // let key: keyof typeof BUYER_STATUS = this.data.model.status;
    // let value = BUYER_STATUS[key];
    // console.log(key);

    // const statusList = [];

    this.buyerForm = this.fb.group({
      buyerCode: [
        //this.data.model.buyerCode,
        {
          value: this.data.model.buyerCode,
          disabled: this.data.model.buyerCode > 0,
        },
        // Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      name: [
        this.data.model.name,
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      mobileNos: [
        this.data.model.mobileNos,
        Validators.compose([Validators.maxLength(100)]),
      ],
      telephoneNos: [
        this.data.model.telephoneNos,
        Validators.compose([Validators.maxLength(100)]),
      ],
      cusdec: [
        this.data.model.cusdec,
        Validators.compose([Validators.maxLength(11)]),
      ],
      fax: [
        this.data.model.fax,
        Validators.compose([Validators.maxLength(100)]),
      ],
      status: [
        this.data.model.status,
        Validators.compose([Validators.required, Validators.maxLength(2)]),
      ],
    });

    // this.Buyer = this.data.model;
    this.id = this.data.model.buyerCode;
    this.edit = this.id ? true : false;
    if (this.edit) this.value.set(this.data.model.name);

    // if (!this.edit)
    //   this.buyerForm.setAsyncValidators(this.isDuplicateCountry()); // assign validator func here
  }

  addAddress(address: Address) {}

  processStatusList() {
    let myobj: st | null = {
      key: null,
      val: null,
    };
    this.statusList = [];
    console.log('prior to add new array :', this.statusList);
    for (let [key, value] of Object.entries(BUYER_STATUS)) {
      myobj.key = key;
      myobj.val = value;
      this.statusList.push(myobj);
      console.log('new array :', this.statusList);

      console.log('key : ', myobj.key);
      console.log('val : ', myobj.val);
      console.log(this.statusList.length);
    }

    for (let x = 0; x < this.statusList.length; x++) {
      console.log(this, this.statusList[x]);
    }
  }

  override ngOnInit() {
    //  this.id = this.data.model.id;
    this.buyerForm.valueChanges
      //.pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.buyerForm.dirty) {
          console.log('Form Model has been loaded.');
        } else {
          console.log('Form was updated by the user.');
        }
      });
    this.processStatusList();
  }

  pageIndex: number = 10;
  pageSize: number = 10;
  defaultSortColumn!: string;

  submitEntry(entry: Buyer) {
    console.log('submit entry : ', entry);

    const buyer = entry.buyerCode > 0 ? entry : <Buyer>{};
    if (buyer) {
      buyer.name = this.buyerForm.controls['name'].value;
      buyer.telephoneNos = this.buyerForm.controls['telephoneNos'].value;
      buyer.mobileNos = this.buyerForm.controls['mobileNos'].value;
      buyer.cusdec = this.buyerForm.controls['cusdec'].value;
      buyer.fax = this.buyerForm.controls['fax'].value;
      buyer.status = this.buyerForm.controls['status'].value;
    }
    if (this.id > 0) {
      super.editEntry(buyer).subscribe((res) => {
        this.baseService.getEntries(
          APPAREL_PRO_UI_PARAMS.paging.pageIndex,
          APPAREL_PRO_UI_PARAMS.paging.pageSize,
          this.defaultSortColumn,
          'asc',
          '',
          ''
        );
        this.toastrService.success(`Buyer: ${buyer.name} updated Successfully`);
      });
    } else {
      console.log('NEW Buyer : ', buyer);

      super
        .addEntry(buyer)
        // .pipe(
        //   catchError((error: any) => {
        //     if (error.status == 401) {
        //       console.log('Error : ', error.status + ' : ' + error);
        //     }
        //     if (error.status == 403) {
        //       console.error(
        //         `Backend returned code ${error.status}, body was: `,
        //         error.error
        //       );
        //     }
        //     console.error(
        //       'Hi Thusith an error occurred in COMPONENT:',
        //       error.error
        //     );
        //     // this.toastrService.error(error);
        //     // Optionally, re-throw the error or return a default value
        //     return throwError(() => {
        //       error.timestamp = Date.now();
        //       return error;
        //     });
        //   })
        // )
        .subscribe(() => {
          this.toastrService.success(`Buyer: ${buyer.name} added Successfully`);
        });
    }
    this.closeDialog();
  }

  closeDialog() {
    // this.buyerForm.valueChanges.subscribe(() => {
    //   if (this.buyerForm.dirty) {
    //     console.log('changes detected');
    //   }
    // });
    this.dialogRef.close();
  }

  isDuplicateCountry(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      const code = this.buyerForm.controls['code'].value;

      return super.isDuplicated(code).pipe(
        map((res: any) => {
          return res ? { isDuplicateCountry: true } : null;
        })
      );
    };
  }
}
