import { Component, Inject, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { CountryService } from '../../Services/countryService';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf, NgFor } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { InjectorService } from '../../Services/InjectorService';
import { COUNTRY_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { baseform } from '../../common/baseform';
import { MatDividerModule } from '@angular/material/divider';
import { Bank } from '../../Models/References/Bank';
import { BankService } from '../../Services/bank.service';
import { CurrencyService } from '../../Services/currencyService';
import { Currency } from '../../Models/References/Currency';

@Component({
  selector: 'app-bank-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    MatDialogActions,
    MatDialogContent,
    NgIf,
    NgFor,
    MatDividerModule,
  ],
  templateUrl: './bank-form.component.html',
  styleUrl: './bank-form.component.css',
})
export class BankFormComponent extends baseform<Bank> {
  bankForm!: FormGroup;
  fb: FormBuilder = new FormBuilder();
  override id!: number;

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  filterQuery: string = '';
  Bank!: Bank;
  fileResult: any;
  imgSrc: any = '../../../assets/Image-place-holder.png';

  changes = new BehaviorSubject<any>('').asObservable;

  countries: MatTableDataSource<Bank> = new MatTableDataSource();

  currencies: Currency[] = [];

  constructor(
    @Inject(COUNTRY_SERVICE_PLUGIN) bankService: InjectorService<Bank>,
    private toastrService: ToastrService,
    private validationService: BankService,
    private dialogRef: MatDialogRef<BankFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Bank },
    private currencyService: CurrencyService
  ) {
    super(bankService, validationService, data);
    this.bankForm = this.fb.group({
      id: [this.data.model.id],
      bankCode: [
        this.data.model.bankCode,
        Validators.compose([Validators.required, Validators.maxLength(6)]),
      ],
      name: [
        this.data.model.name,
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      swiftCode: [
        this.data.model.swiftCode,
        Validators.compose([Validators.required, Validators.maxLength(6)]),
      ],
      currencyCode: [
        this.data.model.currencyCode,
        Validators.compose([
          Validators.required,
          // Validators.minLength(2),
          // Validators.maxLength(3),
        ]),
      ],
      //addressId: [this.data.model.addressId, Validators.required],
      loanLimit: [
        this.data.model.loanLimit,
        Validators.compose([Validators.required, Validators.maxLength(6)]),
      ],
      telephoneNos: [
        this.data.model.telephoneNos,
        Validators.compose([Validators.required, Validators.maxLength(6)]),
      ],
    });

    this.Bank = this.data.model;
    this.id = this.data.model.id;
    this.edit = this.id ? true : false;
    if (this.edit) this.value.set(this.data.model.name);

    if (!this.edit) this.bankForm.setAsyncValidators(this.isDuplicateBank()); // assign validator func here
  }

  override ngOnInit() {
    this.id = this.data.model.id;
    this.bankForm.valueChanges
      //.pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.bankForm.dirty) {
          console.log('Form Model has been loaded.');
        } else {
          console.log('Form was updated by the user.');
        }
      });

    this.currencyService
      .getEntries(0, 9999, 'code', 'asc', '', '')
      .subscribe((res) => {
        this.currencies = res.items;
      });
  }

  submitEntry(entry: Bank) {
    const Bank = this.id > 0 ? entry : <Bank>{};
    if (Bank) {
      Bank.bankCode = this.bankForm.controls['bankCode'].value;
      Bank.name = this.bankForm.controls['name'].value;
      Bank.currencyCode = this.bankForm.controls['currencyCode'].value;
      Bank.loanLimit = this.bankForm.controls['LoanLimit'].value;
      Bank.swiftCode = this.bankForm.controls['swiftCode'].value;
      Bank.telephoneNos = this.bankForm.controls['telephoneNos'].value;
    }
    if (this.id > 0) {
      super.editEntry(Bank).subscribe((res) => {
        this.toastrService.success(`Bank: ${Bank.name} updated Successfully`);
      });
    } else {
      super
        .addEntry(Bank)
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
          this.toastrService.success(`Bank: ${Bank.name} added Successfully`);
        });
    }
    this.closeDialog();
  }

  closeDialog() {
    // this.bankForm.valueChanges.subscribe(() => {
    //   if (this.bankForm.dirty) {
    //     console.log('changes detected');
    //   }
    // });
    this.dialogRef.close();
  }

  isDuplicateBank(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      const code = this.bankForm.controls['bankCode'].value;

      return super.isDuplicated(code).pipe(
        map((res: any) => {
          return res ? { isDuplicateBank: true } : null;
        })
      );
    };
  }
}
