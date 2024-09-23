import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GarmentType } from '../../Models/References/GarmentType';
import { GarmentTypeService } from '../../Services/garmentTypeService';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { baseform } from '../../common/baseform';
import { InjectorService } from '../../Services/InjectorService';

import { GARMENT_TYPE_SERVICE_PLUGIN } from '../../tokens/tokenConfig';

@Component({
  selector: 'app-garment-type-form',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    CommonModule,
    NgIf,
  ],
  templateUrl: './garment-type-form.component.html',
  styleUrl: './garment-type-form.component.css',
})
export class GarmentTypeFormComponent extends baseform<GarmentType> {
  garmentTypeForm!: FormGroup;
  override id: number = 0;
  garmentType!: GarmentType;
  override caption: string = 'Submit';
  fb: FormBuilder = new FormBuilder();

  constructor(
    @Inject(GARMENT_TYPE_SERVICE_PLUGIN)
    service: InjectorService<GarmentType>,
    private toastrService: ToastrService,
    // override errorHandlerService: ErrorHandlerService,
    // override authService: AuthenticationService,
    private validationService: GarmentTypeService,
    private dialogRef: MatDialogRef<GarmentTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: GarmentType }
  ) {
    super(
      service,
      validationService,
      // toastrService,
      // errorHandlerService,
      // authService,
      data
    );

    this.garmentTypeForm = this.fb.group({
      id: [this.data.model.id],
      typeName: [
        this.data.model.typeName,
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
    });

    this.edit = data.model.id ? true : false;
  }

  override ngOnInit(): void {
    this.id = this.data.model.id;
  }

  submitEntry(entry: GarmentType) {
    const garmentType = this.id > 0 ? entry : <GarmentType>{};
    if (garmentType) {
      garmentType.typeName = this.garmentTypeForm.controls['typeName'].value;
    }
    if (this.id > 0) {
      console.log('edit');

      super.editEntry(garmentType);
    } else {
      console.log('add');
      super.addEntry(garmentType);
      this.toastrService.success(
        `Unit: ${garmentType.typeName} updated Successfully`
      );
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
