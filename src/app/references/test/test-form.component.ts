import { Component, Inject } from '@angular/core';
import { baseform_v1 } from '../../common/baseform_v1';
import { Country } from '../../Models/References/Country';
import { FormControlService } from '../../common/form-control.service';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import {
  COUNTRY_SERVICE_PLUGIN,
  FORM_CONTROL_COUNTRY_SERVICE,
} from '../../tokens/tokenConfig';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { CountryService } from '../../Services/countryService';
import { InjectorService } from '../../Services/InjectorService';

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    AngularMaterialModule,
    MatDialogActions,
    MatDialogContent,
  ],
  templateUrl: './test-form.component.html',
  styleUrl: './test-form.component.css',
})
export class TestFormComponent extends baseform_v1<Country> {
  countryForm!: FormGroup;
  imgSrc: any = '../../../assets/Image-place-holder.png';
  entry = <Country>{};
  fileResult: any;
  constructor(
    @Inject(FORM_CONTROL_COUNTRY_SERVICE) fcs: FormControlService<Country>,
    @Inject(COUNTRY_SERVICE_PLUGIN) service: InjectorService<Country>,
    // @Inject(MAT_DIALOG_DATA)
    // override data: { model: Country },
    override toastrService: ToastrService,
    override errorHandlerService: ErrorHandlerService,
    override authService: AuthenticationService, //  override dialogRef: DialogRef<TestFormComponent>
    private countryService: CountryService,
    private dialogRef: MatDialogRef<TestFormComponent>
  ) {
    super(fcs, service, toastrService, errorHandlerService, authService);
    //  this.countryForm = fcs.getFormGroup();
    this.edit = this.entry.code ? true : false;
    this.fileResult = this.entry.flag;
    this.imgSrc = this.entry.flag
      ? this.imageDataUrl(this.entry.flag)
      : this.imgSrc;
  }

  submitEntry(entry: Country) {
    console.log('inside test from : ', entry);

    const country = this.id > 0 ? entry : <Country>{};
    if (country) {
      country.code = this.countryForm.controls['code'].value;
      country.name = this.countryForm.controls['name'].value;
      country.flag = this.countryForm.controls['flag'].value;
      country.flag = this.fileResult;
    }
    if (this.id > 0) {
      this.editEntry(country);
    } else {
      super.addEntry(country);
      this.toastrService.success(
        `country: ${country.name} updated Successfully`
      );
      this.dialogRef.close();
    }

    //this.addEntry(country);
    // console.log('edit country override');
    // console.log('ID : ', this.id);

    // const country = this.id > 0 ? entry : <Country>{};
    // if (country) {
    //   country.code = this.countryForm.controls['code'].value;
    //   country.name = this.countryForm.controls['name'].value;
    //   country.flag = this.countryForm.controls['flag'].value;
    //   country.flag = this.fileResult;
    // }

    // console.log('id :', this.id);

    // if (this.id > 0) {
    //   return this.countryService
    //     .UpdateCountry(country.code, country)
    //     .subscribe({
    //       next: () => {},
    //       error: (err) => {
    //         const error: string = err.error;
    //         // this.subscribedMessage.next(error);
    //         this.errorHandlerService.handleError(err);
    //         // this.isSubscribed.next(true);
    //       },
    //       complete: () => {
    //         this.toastrService.success(
    //           `country: ${country.name} updated Successfully`
    //         );
    //         this.dialogRef.close();
    //       },
    //     });
    // } else {
    //   return this.countryService.addCountry(country).subscribe({
    //     next: () => {},
    //     error: (err) => {
    //       const error: string = err.error;
    //       // this.subscribedMessage.next(error);
    //       this.errorHandlerService.handleError(err);
    //       // this.isSubscribed.next(true);
    //     },
    //     complete: () => {
    //       this.toastrService.success(
    //         `country: ${country.name}, added Successfully`
    //       );
    //       this.dialogRef.close();
    //     },
    //   });
    // }
  }

  override editEntry(entry: Country): void {
    console.log('calling baseform edit entry in tes form :');
    super.editEntry(entry);
  }
  override addEntry(entry: Country): void {
    console.log('calling super in addEntry in test form component : ', entry);
    super.addEntry(entry);
  }

  closeDialog() {
    this.dialogRef.close();
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
    this.entry.flag = this.fileResult;
  }

  imageDataUrl(data: any): string {
    const url: string = 'data:image/jpeg;base64,' + data;
    return url;
  }

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
}
