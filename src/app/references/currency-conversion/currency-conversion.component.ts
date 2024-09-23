import { Component } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-currency-conversion',
  standalone: true,
  imports: [CalendarModule, FormsModule, ReactiveFormsModule],
  templateUrl: './currency-conversion.component.html',
  styleUrl: './currency-conversion.component.css',
})
export class CurrencyConversionComponent {
  date: Date = new Date();
  date1!: Date;
  date2!: Date;
  date3!: Date;
  minDate = new Date('01/05/2024');
}
