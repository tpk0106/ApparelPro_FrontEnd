import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
@Component({
  selector: 'app-field',
  standalone: true,
  imports: [NgIf],
  templateUrl: './field.component.html',
  styleUrl: './field.component.css',
})
export class FieldComponent {
  @Input() label: string = '';
  @Input() field: string = '';
  @Input() formControlName: string = '';
  @Input()
  formgroup!: FormGroup<any>;
  @Output() formControlEvent: EventEmitter<FormControl> = new EventEmitter();

  constructor(@Optional() private formControl: NgControl) {}

  ngOnInit() {
    console.log('inside field component');
    console.log('inside field', this.field);
    console.log('inside field', this.formgroup);
  }

  // @HostListener('keypress')
  // getFormControl(): void {
  //   if (this.formControl) {
  //     this.formControl.control?.valueChanges.subscribe((r) => console.log(r));
  //   }
  //   this.formControlEvent.emit(this.formControl.control as FormControl);
  // }
}
