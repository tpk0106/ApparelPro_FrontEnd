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
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Currency } from '../../Models/References/Currency';
import { CurrencyService } from '../../Services/currencyService';
import { Country } from '../../Models/References/Country';
import { baseform } from '../../common/baseform';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { InjectorService } from '../../Services/InjectorService';
import { CURRENCY_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-currency-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    MatDialogActions,
    MatDialogContent,
    MatDividerModule,
  ],
  templateUrl: './currency-form.component.html',
  styleUrl: './currency-form.component.css',
})
export class CurrencyFormComponent extends baseform<Currency> {
  currencyForm!: FormGroup;
  override id: number = 0;
  filterQuery: string = '';
  currency!: Currency;
  countries: Country[] = [];

  protected readonly value = signal('');
  changes = new BehaviorSubject<any>('').asObservable;

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  constructor(
    @Inject(CURRENCY_SERVICE_PLUGIN) service: InjectorService<Currency>,
    private validationService: CurrencyService,
    private toastrService: ToastrService,
    // override errorHandlerService: ErrorHandlerService,
    // override authService: AuthenticationService,
    private dialogRef: MatDialogRef<CurrencyFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Currency },
    private countryService: CountryService
  ) {
    super(
      service,
      validationService,
      //  toastrService,
      // errorHandlerService,
      // authService,
      data
    );

    this.currencyForm = this.fb.group({
      id: [this.data.model.id],
      code: [
        {
          value: this.data.model.code,
          disabled: this.data.model.id > 0,
        },
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      name: [
        this.data.model.name,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      countryCode: [
        this.data.model.countryCode,
        Validators.compose([Validators.required]),
      ],
      flag: [
        super.imageDataUrl(
          this.countries.find((c) => c.code == this.data.model.countryCode)
            ?.flag
        ),
      ],
    });

    this.currency = this.data.model;
    this.id = this.data.model.id;
    this.edit = this.id ? true : false;
    if (this.edit) this.value.set(this.data.model.name);

    if (!this.edit) {
      this.currencyForm.setAsyncValidators(this.isDuplicateCurrency()); // assign validator func here
      //this.currencyForm.setAsyncValidators(this.isDuplicateCurrency()); // assign validator func here
    }
  }

  fb: FormBuilder = new FormBuilder();

  override ngOnInit() {
    this.countryService
      .getEntries(0, 9999, 'name', 'asc', '', '')
      .subscribe((res) => {
        this.countries = res.items;
      });
  }

  submitEntry(entry: Currency) {
    const currency = this.id > 0 ? entry : <Currency>{};
    console.log('ID :', this.id);

    if (currency) {
      currency.code = this.currencyForm.controls['code'].value;
      currency.name = this.currencyForm.controls['name'].value;
      currency.countryCode = this.currencyForm.controls['countryCode'].value;
    }
    if (this.id > 0) {
      super.editEntry(currency).subscribe(() => {
        this.toastrService.success(
          `currency: ${currency.name} updated Successfully`
        );
      });
    } else {
      super.addEntry(currency).subscribe(() => {
        this.toastrService.success(
          `currency: ${currency.name} added Successfully`
        );
      });
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  isDuplicateCurrency(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      const code = this.currencyForm.controls['code'].value;
      const countryCode = this.currencyForm.controls['countryCode'].value;
      return super.isDuplicated(code, countryCode).pipe(
        map((res: any) => {
          return res ? { isDuplicateCurrency: true } : null;
        })
      );
    };
  }
}
