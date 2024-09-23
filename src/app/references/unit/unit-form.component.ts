import { Component, Inject } from '@angular/core';
import { Unit } from '../../Models/References/Unit';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UNIT_SERVICE_PLUGIN } from '../../tokens/tokenConfig';
import { InjectorService } from '../../Services/InjectorService';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerService } from '../../misc/error-handler.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UnitService } from '../../Services/unit.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { baseform } from '../../common/baseform';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [AngularMaterialModule, MatDialogModule, ReactiveFormsModule, NgIf],
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.css',
})
export class UnitFormComponent extends baseform<Unit> {
  unitForm!: FormGroup;
  // entry = <Unit>{};
  fb: FormBuilder = new FormBuilder();
  override id!: number;

  constructor(
    // @Inject(FORM_CONTROL_UNIT_SERVICE) fcs: FormControlService<Unit>,
    @Inject(UNIT_SERVICE_PLUGIN) service: InjectorService<Unit>,
    private toastrService: ToastrService,
    //   override errorHandlerService: ErrorHandlerService,
    //  override authService: AuthenticationService,
    private validationService: UnitService,
    private dialogRef: MatDialogRef<UnitFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public override data: { model: Unit }
  ) {
    super(
      service,
      validationService,
      //   toastrService,
      //  errorHandlerService,
      //   authService,
      data
    );
    this.unitForm = this.fb.group({
      code: [
        this.data.model.code,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(3),
        ]),
      ],
      description: [
        this.data.model.description,
        Validators.compose([Validators.required, Validators.maxLength(30)]),
      ],
    });

    this.edit = data.model.code ? true : false;

    if (!this.edit) this.unitForm.setAsyncValidators(this.isDuplicateUnit()); // assign validator func here
  }

  override ngOnInit(): void {
    this.id = this.data.model.id;
  }

  submitEntry(entry: Unit) {
    const unit = this.id > 0 ? entry : <Unit>{};
    if (unit) {
      unit.code = this.unitForm.controls['code'].value;
      unit.description = this.unitForm.controls['description'].value;
    }
    if (this.id > 0) {
      super.editEntry(unit);
    } else {
      super.addEntry(unit);
      this.toastrService.success(
        `Unit: ${unit.description} updated Successfully`
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
      var code = this.unitForm.controls['code'].value;
      return super.isDuplicated(code).pipe(
        map((res: any) => {
          return res ? { isDuplicateUnit: true } : null;
        })
      );
    };
  }
}
