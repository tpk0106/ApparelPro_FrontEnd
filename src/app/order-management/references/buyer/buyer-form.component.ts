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
import { BUYER_SERVICE_PLUGIN } from '../../../tokens/tokenConfig';
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
  ],
  templateUrl: './buyer-form.component.html',
  styleUrl: './buyer-form.component.css',
})
export class BuyerFormComponent extends baseform<Buyer> {
  buyerForm!: FormGroup;
  fb: FormBuilder = new FormBuilder();
  override id!: number;

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  filterQuery: string = '';
  buyer!: Buyer;
  fileResult: any;
  imgSrc: any = '../../../assets/Image-place-holder.png';

  changes = new BehaviorSubject<any>('').asObservable;

  countries: MatTableDataSource<Buyer> = new MatTableDataSource();

  constructor(
    @Inject(BUYER_SERVICE_PLUGIN) buyerService: InjectorService<Buyer>,
    private toastrService: ToastrService,
    private validationService: BuyerService,
    private dialogRef: MatDialogRef<BuyerFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Buyer }
  ) {
    super(buyerService, validationService, data);
    this.buyerForm = this.fb.group({
      buyerCode: [
        this.data.model.buyerCode,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      name: [
        this.data.model.name,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      mobileNos: [
        this.data.model.mobileNos,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      telephoneNos: [
        this.data.model.telephoneNos,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      cusdec: [
        this.data.model.cusdec,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      status: [
        this.data.model.status,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      // code: [
      //   {
      //     value: this.data.model.code,
      //     disabled: this.data.model.id > 0,
      //   },
      //   Validators.compose([
      //     Validators.required,
      //     Validators.minLength(2),
      //     Validators.maxLength(3),
      //   ]),
      // ],
    });

    // this.Buyer = this.data.model;
    // this.id = this.data.model.id;
    this.edit = this.id ? true : false;
    if (this.edit) this.value.set(this.data.model.name);

    // if (!this.edit)
    //   this.buyerForm.setAsyncValidators(this.isDuplicateCountry()); // assign validator func here
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
  }

  submitEntry(entry: Buyer) {
    const Buyer = this.id > 0 ? entry : <Buyer>{};
    if (Buyer) {
      Buyer.buyerCode = this.buyerForm.controls['buyerCode'].value;
      Buyer.name = this.buyerForm.controls['name'].value;
    }
    if (this.id > 0) {
      super.editEntry(Buyer).subscribe((res) => {
        this.toastrService.success(`Buyer: ${Buyer.name} updated Successfully`);
      });
    } else {
      super
        .addEntry(Buyer)
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
          this.toastrService.success(`Buyer: ${Buyer.name} added Successfully`);
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
