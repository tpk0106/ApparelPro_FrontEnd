import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  model,
} from '@angular/core';
//import { MatDialogRef } from '@angular/material/dialog';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { Country } from '../Models/References/Country';

@Component({
  selector: 'app-app-pro-dialog',
  standalone: true,
  imports: [
    AngularMaterialModule,
    MatDialogActions,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './app-pro-dialog.component.html',
  styleUrl: './app-pro-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AppProDialogComponent<T> {
  //readonly dialog = inject(MatDialog);
  form!: FormGroup;
  //model!: Country;
  public readonly dialogRef = inject(MatDialogRef<T>);

  //constructor(@Inject(model) model: T) {}
  constructor() {}
}
