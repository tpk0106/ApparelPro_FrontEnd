import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../auth/authentication.service';
import { NgIf } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, AngularMaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  private destroySubject = new Subject();

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    authService.authStatus$
      .pipe(takeUntil(this.destroySubject))
      .subscribe((res) => (this.isLoggedIn = res));
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  nGOnDestroy() {
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
