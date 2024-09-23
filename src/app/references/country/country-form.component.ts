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
import { Country } from '../../Models/References/Country';
import { CountryService } from '../../Services/countryService';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';
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
import { CurrencyService } from '../../Services/currencyService';
@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AngularMaterialModule,
    MatDialogActions,
    MatDialogContent,
    NgIf,
    MatDividerModule,
  ],
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.css',
})
export class CountryFormComponent extends baseform<Country> {
  countryForm!: FormGroup;
  fb: FormBuilder = new FormBuilder();
  override id!: number;

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  filterQuery: string = '';
  country!: Country;
  fileResult: any;
  imgSrc: any = '../../../assets/Image-place-holder.png';

  changes = new BehaviorSubject<any>('').asObservable;

  countries: MatTableDataSource<Country> = new MatTableDataSource();

  constructor(
    @Inject(COUNTRY_SERVICE_PLUGIN) countryService: InjectorService<Country>,
    private toastrService: ToastrService,
    private validationService: CountryService,
    private dialogRef: MatDialogRef<CountryFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Country }
  ) {
    super(countryService, validationService, data);
    this.countryForm = this.fb.group({
      id: [this.data.model.id],
      name: [
        this.data.model.name,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
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
      flag: [this.data.model.flag, Validators.required],
    });

    this.country = this.data.model;
    this.id = this.data.model.id;
    this.edit = this.id ? true : false;
    if (this.edit) this.value.set(this.data.model.name);

    this.fileResult = this.data.model.flag;
    this.imgSrc = this.data.model.flag
      ? this.imageDataUrl(this.data.model.flag)
      : this.imgSrc;
    if (!this.edit)
      this.countryForm.setAsyncValidators(this.isDuplicateCountry()); // assign validator func here
  }

  override ngOnInit() {
    this.id = this.data.model.id;
    this.countryForm.valueChanges
      //.pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.countryForm.dirty) {
          console.log('Form Model has been loaded.');
        } else {
          console.log('Form was updated by the user.');
        }
      });
  }

  submitEntry(entry: Country) {
    const country = this.id > 0 ? entry : <Country>{};
    if (country) {
      country.code = this.countryForm.controls['code'].value;
      country.name = this.countryForm.controls['name'].value;
      country.flag = this.fileResult;
    }
    if (this.id > 0) {
      super.editEntry(country).subscribe((res) => {
        this.toastrService.success(
          `country: ${country.name} updated Successfully`
        );
      });
    } else {
      super
        .addEntry(country)
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
          this.toastrService.success(
            `country: ${country.name} added Successfully`
          );
        });
    }
    this.closeDialog();
  }

  closeDialog() {
    // this.countryForm.valueChanges.subscribe(() => {
    //   if (this.countryForm.dirty) {
    //     console.log('changes detected');
    //   }
    // });
    this.dialogRef.close();
  }

  isDuplicateCountry(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<{ [key: string]: any } | null> => {
      const code = this.countryForm.controls['code'].value;

      return super.isDuplicated(code).pipe(
        map((res: any) => {
          return res ? { isDuplicateCountry: true } : null;
        })
      );
    };
  }

  updateImage($event: Event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;

      let binaryResult = this.convertDataURIToBinary(reader.result);
      var decodedStringBtoA = this.stringFromArray(binaryResult);
      var encodedStringBtoA = window.btoa(decodedStringBtoA); //  Base64-encoded ASCII string from a binary string - encode

      this.fileResult = encodedStringBtoA;
    };

    this.imgSrc = reader.readAsDataURL(
      ($event.target as HTMLInputElement).files![0]
    );
    this.country.flag = this.fileResult;
  }

  // override imageDataUrl(data: any): string {
  //   const url: string = 'data:image/jpeg;base64,' + data;
  //   return url;
  // }

  convertDataURIToBinary(dataURI: any) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64); // create ASCII string containing decoded data from encodedData - decode
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  stringFromArray(data: any) {
    var count = data.length;
    var str = '';

    for (var index = 0; index < count; index += 1)
      str += String.fromCharCode(data[index]);

    return str;
  }

  ngDestroy() {}
}
