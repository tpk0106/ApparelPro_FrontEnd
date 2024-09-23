import { Inject, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MyControl } from './IControl';

@Injectable({
  providedIn: 'root',
})
export class FormControlService<T> {
  constructor(
    //_controls: MyControl[] // protected service: InjectorService<T> //
    // ******************************************** working code
    @Inject('CountryForm') _controls: MyControl[]
    // ********************************************
    //@Inject('form') protected _controls: MyControl[] // protected  _controls: MyControl[]
  ) {
    this.controlsUse = _controls;
  }

  controlsUse: MyControl[];
  fg: FormGroup = new FormGroup({});

  getFormGroup() {
    return this.fg;
  }

  buildFormGroup(): FormGroup {
    for (let i = 0; i < this.controlsUse.length; i++) {
      let _name = this.controlsUse[i].name;
      let _val = this.controlsUse[i].value;
      var str = this.controlsUse[i].validators.toString();
      let _validators = str.split(',');
      let fc = new FormControl();

      for (let val = 0; val < _validators.length; val++) {
        switch (_validators[val].substring(0, 3)) {
          case 'req':
            fc.addValidators([Validators.required]);
            break;
          case 'max':
            let max = _validators[val];
            let maxStart = max.indexOf('(');
            let maxEnd = max.indexOf(')');
            const maxval = max.substring(++maxStart, maxEnd);
            fc.addValidators([Validators.maxLength(+maxval)]);
            break;
          case 'min':
            let min = _validators[val];
            let minStart = min.indexOf('(');
            let minEnd = min.indexOf(')');
            const minval = min.substring(++minStart, minEnd);
            fc.addValidators([Validators.minLength(+minval)]);
            break;
          case 'minmax':
            let minmax = _validators[val];
            let _minmax = minmax.split(',');
            for (let i = 0; i < _minmax.length; i++) {
              switch (_minmax[i].substring(0, 3)) {
                case 'min':
                  let minindex = _minmax[i].indexOf('minlength(');

                  const minval = _minmax[i].substring(
                    minindex,
                    _minmax[i].indexOf(')')
                  );
                  fc.addValidators([Validators.minLength(+minval)]);
                  break;
                case 'max':
                  let maxindex = _minmax[i].indexOf('maxlength(');

                  const maxval = _minmax[i].substring(
                    maxindex,
                    _minmax[i].indexOf(')')
                  );
                  fc.addValidators([Validators.maxLength(+maxindex)]);
                  break;
                default:
                  break;
              }
            }
        }
      }
      fc.setValue(_val);
      this.fg.addControl(_name, fc);
    }
    console.log('F GROUP :', this.fg);

    return this.fg;
  }
}
