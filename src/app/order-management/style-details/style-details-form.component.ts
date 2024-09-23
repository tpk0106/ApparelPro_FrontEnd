import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STYLE_DETAILS_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { InjectorService } from '../../Services/InjectorService';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { baseform } from '../../common/baseform';
import { Style } from '../../Models/OrderManagement/Style';
import { StyleDetailsService } from '../../Services/OrderManagement/style-details.service';
import { GarmentTypeService } from '../../Services/garmentTypeService';
import { UnitService } from '../../Services/unit.service';
import { GarmentType } from '../../Models/References/GarmentType';
import { Unit } from '../../Models/References/Unit';

@Component({
  selector: 'app-style-details-form',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './style-details-form.component.html',
  // styles: [
  //   `
  //     :host {
  //       display: block;
  //       background: #fff;
  //       border-radius: 8px;
  //       padding: 16px;
  //     }
  //   `,
  // ],
  styleUrl: './style-details-form.component.css',
})
export class StyleDetailsFormComponent extends baseform<Style> {
  styleDetailsForm!: FormGroup;
  fb: FormBuilder = new FormBuilder();
  override id!: number;

  styles: Style[] = [];
  garmentTypes: GarmentType[] = [];
  units: Unit[] = [];

  constructor(
    @Inject(STYLE_DETAILS_SERVICE_PLUGIN) service: InjectorService<Style>,
    private toastrService: ToastrService,
    private validationService: StyleDetailsService,
    private dialogRef: MatDialogRef<StyleDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Style },
    private garmenttypeService: GarmentTypeService,
    private unitService: UnitService
  ) {
    super(service, validationService, data);
    //  console.log('constructor : ', data.model);
    //this.id = data.model.buyerCode?;
    // console.log('id : ', this.id);

    this.styleDetailsForm = this.fb.group({
      garmentType: [
        {
          value: this.data.model.typeCode,
          disabled: this.data.model.id > 0,
        },
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      styleCode: [
        {
          value: this.data.model.styleCode,
          disabled: this.data.model.id > 0,
        },

        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      unit: [
        this.data.model.unit,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      unitPrice: [
        this.data.model.unitPrice,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
      quantity: [
        this.data.model.quantity,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
    });
  }

  override ngOnInit(): void {
    this.id = this.data.model.id;
    this.garmenttypeService
      .getEntries(0, 999, 'typeName', 'asc', '', '')
      .subscribe((res) => {
        this.garmentTypes = res.items;
      });

    this.unitService
      .getEntries(0, 999, 'description', 'asc', '', '')
      .subscribe((res) => {
        this.units = res.items;
      });
  }

  submitEntry(entry: Style) {
    console.log('submit entry id : ', this.data.model.id);
    console.log('submit entry : ', entry);
    console.log('buyer : ', this.data.model.buyer);

    const style = this.data.model.id > 0 ? entry : <Style>{};
    if (style) {
      style.buyerCode = this.data.model.buyerCode;
      style.order = this.data.model.order.trim();
      style.typeCode = this.styleDetailsForm.controls['garmentType'].value;
      style.styleCode =
        this.styleDetailsForm.controls['styleCode'].value.trim();
      style.unit = this.styleDetailsForm.controls['unit'].value;
      style.unitPrice = this.styleDetailsForm.controls['unitPrice'].value;
      style.quantity = this.styleDetailsForm.controls['quantity'].value;
    }
    if (this.id > 0) {
      console.log('edit entry', style);

      super.editEntry(style).subscribe((res) => {
        this.toastrService.success(
          `style: ${style.styleCode} updated Successfully`
        );
        // this.editEntry(style);
      });
    } else {
      console.log('add entry', style);
      super.addEntry(style).subscribe(() => {
        this.toastrService.success(
          `style: ${style.styleCode} added Successfully`
        );
      });

      //  this.toastrService.success(`style: ${style.buyer} updated Successfully`);
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
