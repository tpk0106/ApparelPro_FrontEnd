import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import User from '../../Models/register/User';
import { ButtonComponent } from '../../utilities/button/button.component';
import { STATUS } from '../../misc/status-info';
//import { UserService } from '../../Services/userService';
import { UserService } from '../../Services/UserService';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, ButtonComponent],
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private userService: UserService) {}

  registerForm!: FormGroup;
  user!: User;

  // email!: string;
  // knownAs!: string;
  // password!: string;
  // gender!: string;
  // city!: string;
  // country!: string;
  // dateOfBirth!: Date;
  // photo!: BinaryType;

  caption: string = 'Submit';
  width: number = 100;

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      knownAS: '',
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      confirmpassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
      dateOfBirth: null,
      gender: '',
      city: null,
      country: null,
      photo: null,
    });
    this.user = this.registerForm.value;
  }

  validationErrorsForRegister: string[] = []; //test
  validationErrors: [] = [];
  //OPERATION: STATUS = STATUS.ADDNEW;

  matchValues(matchTo: string): ValidatorFn {
    // this.findInvalidControlsRecursive(this.registerForm!)
    return (control: AbstractControl) => {
      if (control.parent && control.parent.controls) {
        console.log('has value');
        return control?.value ===
          (control?.parent?.controls as { [key: string]: AbstractControl })[
            matchTo
          ].value
          ? null
          : { isMatching: true };
        //return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
      }
      return null;
    };
  }

  onCancel() {}

  onRegister(user: User) {
    console.log('register : ', user);
    console.dir('PRIOR TO REGISTER : ');
    console.dir(this.registerForm?.value);
    console.dir(this.user);
    this.userService.registerUser(user).subscribe({
      next: (country) => () => {},
      error: (err) => {
        const error: string = err.error;
        // this.subscribedMessage.next(error);
        //   this.errorHandlerService.handleError(err);
        // this.isSubscribed.next(true);
      },
      complete: () => {
        console.log('complete');

        //   this.loadCountries();
        // this.toastrService.success(
        //   `country added Successfully, ${country.code}`
        // );
      },
    });
  }
}
