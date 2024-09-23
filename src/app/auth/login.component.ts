import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { AuthenticationService } from './authentication.service';
import { loginRequest } from '../Models/login/loginRequest';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { loginResponse } from '../Models/login/loginResponse';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    AngularMaterialModule,
    RouterLink,
    ReactiveFormsModule,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  //loginRequest: <loginRequest> = new {};

  loggedInUser!: loginResponse;
  loginForm!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    var loginRequest = <loginRequest>{};
    loginRequest.email = this.loginForm.controls['email'].value;
    loginRequest.password = this.loginForm.controls['password'].value;
    this.authService.login(loginRequest).subscribe({
      next: (res) => {
        console.log(res);
        this.loggedInUser = res;
        if (res.success && res.token) {
          localStorage.setItem(this.authService.tokenKey, res.token);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        if (err.status == 401) {
          this.loggedInUser = err.error;
          this.toastrService.show(err.error, 'Login');
        }
      },
      complete: () => {
        console.log('completed login');
      },
    });
  }
}
