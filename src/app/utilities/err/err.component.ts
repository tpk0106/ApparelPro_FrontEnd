import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Optional,
  Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';

@Component({
  selector: 'app-err',
  standalone: true,
  imports: [NgIf],
  templateUrl: './err.component.html',
  styleUrl: './err.component.css',
})
export class ErrComponent {
  @Input() errorMessage: string = '';
  // @Input() formName!: FormGroup;
  @Input() formctrl!: AbstractControl;
  @Input() field: string = '';
  @Output() formControlEvent: EventEmitter<FormControl> = new EventEmitter();
  @Output() keyPressEvent: EventEmitter<KeyboardEvent> = new EventEmitter();

  constructor(@Optional() private formControl: NgControl) {}

  @HostListener('keypress')
  getFormControl(): void {
    if (this.formControl) {
      this.formControl.control?.valueChanges.subscribe((r) => console.log(r));
    }
    this.formControlEvent.emit(this.formControl.control as FormControl);
  }

  handleClick($event: KeyboardEvent) {
    console.log('KEY PRESS');

    this.keyPressEvent.emit($event);
  }
}
