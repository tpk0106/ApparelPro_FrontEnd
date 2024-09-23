import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { CurrencyComponent } from './references/currency/currency.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SideNavbarComponent } from './layouts/side-navbar/side-navbar.component';
import { RegisterComponent } from './register/register/register.component';
import { ButtonComponent } from './utilities/button/button.component';
//import { CurrencyConversionComponent } from './references/currency-conversion/currency-conversion.component';
import { CurrencyExchangeTableComponent } from './references/currency-exchange/currency-exchange-table.component';
import { InterceptAuthentication } from './interceptors/interceptAuthentication';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { NavbarComponent } from './layouts/navbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HomeComponent } from './home/home.component';
import { TestNavBarComponent } from './layouts/test-nav-bar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavComponent } from './layouts/mat-sidenav.component';
import { SideNavComponent } from './layouts/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SideNavbarComponent,
    RegisterComponent,
    ButtonComponent,
    CurrencyExchangeTableComponent,
    NavbarComponent,
    MatSidenavModule,
    HomeComponent,
    TestNavBarComponent,
    MatIcon,
    MatSidenavComponent,
    SideNavComponent,
  ],
})
export class AppComponent {
  title = 'Apparel-Pro';
  #sidenav: any;

  // Ripple is an optional animation for the supported components such as buttons. It is disabled by default and
  // needs to be enabled globally at your main component e.g. app.component.ts by injecting PrimeNGConfig.

  constructor(private primengConfig: PrimeNGConfig) {}
  ngOnInit() {
    // this.primengConfig.ripple = true;
  }

  public isExpanded = true;

  public toggleMenu() {
    this.isExpanded = !this.isExpanded;
    console.log('isexpanded', this.isExpanded);
  }

  myclick() {
    this.#sidenav.toggle();
  }
}
