import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
//import { CountryComponent } from './references/country/country.component';
import { RegisterComponent } from './register/register/register.component';
import { LoginComponent } from './auth/login.component';
import { GarmentTypeTableComponent } from './references/garment-type/garment-type-table.component';
import { CountryTableComponent } from './references/country/country-table.component';
import { CurrencyTableComponent } from './references/currency/currency-table.component';
import { PoComponent } from './po/po.component';
import { CurrencyConversionTableComponent } from './references/currency-conversion/currency-conversion-table/currency-conversion-table.component';
import { CurrencyExchangeTableComponent } from './references/currency-exchange/currency-exchange-table.component';
import { TestFormComponent } from './references/test/test-form.component';
import { UnitTableComponent } from './references/unit/unit-table.component';
import { BankTableComponent } from './references/bank/bank-table.component';
import { StyleDetailsComponent } from './order-management/style-details/style-details.component';
import { AddressTableComponent } from './shared/address/address';
import { BuyerTableComponent } from './order-management/references/buyer/buyer-table.component';
import { BuyerFormComponent } from './order-management/references/buyer/buyer-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'currency-table', component: CurrencyTableComponent },
  { path: 'country-table', component: CountryTableComponent },
  { path: 'garment-type-table', component: GarmentTypeTableComponent },
  // { path: 'country/:id', component: CountryComponent },
  {
    path: 'currency-exchange-table',
    component: CurrencyExchangeTableComponent,
  },
  {
    path: 'currency-conversion-table',
    component: CurrencyConversionTableComponent,
  },
  { path: 'unit-table', component: UnitTableComponent },
  { path: 'bank-table', component: BankTableComponent },
  { path: 'address-table', component: AddressTableComponent },
  { path: 'po', component: PoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test-form', component: TestFormComponent },
  { path: 'style-details', component: StyleDetailsComponent },
  { path: 'buyer-table', component: BuyerTableComponent },
  //{ path: 'buyer-table', component: BuyerFormComponent },
];
