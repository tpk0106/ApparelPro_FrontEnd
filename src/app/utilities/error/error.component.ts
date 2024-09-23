import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { AbstractControl, Form, FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [NgIf],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  @Input() errorMessage: string = '';
  @Input() formName!: AbstractControl;
  @Input() field: string = '';
}
