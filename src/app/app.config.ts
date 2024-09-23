import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CurrencyService } from './Services/currencyService';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CountryService } from './Services/countryService';
import { ToastrService, provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { InterceptAuthentication } from './interceptors/interceptAuthentication';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

import {
  COMPONENT_TYPE,
  FORM_FIELD_OPTIONS,
  SORT_ADDRESS,
  SORT_CODE,
  SORT_GARMENT_TYPE,
  SORT_ORDER,
  SORT_QUOTE_CURRENCY,
} from './misc/paramsConfig';
import { GarmentTypeService } from './Services/garmentTypeService';
import {
  ADDRESS_SERVICE_PLUGIN,
  BANK_SERVICE_PLUGIN,
  BASIS_SERVICE_PLUGIN,
  BUYER_SERVICE_PLUGIN,
  COUNTRY_SERVICE_PLUGIN,
  CURRENCY_CONVERSION_SERVICE_PLUGIN,
  CURRENCY_EXCHANGE_SERVICE_PLUGIN,
  CURRENCY_SERVICE_PLUGIN,
  FORM_CONTROL_COUNTRY_SERVICE,
  FORM_CONTROL_CURRENCY_SERVICE,
  GARMENT_TYPE_SERVICE_PLUGIN,
  PO_SERVICE_PLUGIN,
  STYLE_DETAILS_SERVICE_PLUGIN,
  UNIT_SERVICE_PLUGIN,
} from '../app/tokens/tokenConfig';
import { POService } from './Services/OrderManagement/POService';
import { BasisService } from './Services/basis.service';
import { CurrencyConversionService } from './Services/currency-conversion.service';
import { CurrencyExchangeService } from './Services/currency-exchange.service';
import { FormControlService } from './common/form-control.service';
import { Country } from './Models/References/Country';
import { Currency } from './Models/References/Currency';
import { UnitService } from './Services/unit.service';
import { BankService } from './Services/bank.service';
import { StyleDetailsService } from './Services/OrderManagement/style-details.service';
import { AddressService } from './Services/address.service';
import {
  MAT_FORM_FIELD,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { BuyerService } from './Services/buyer.service';

//import { navbarData } from './misc/nav-data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideToastr(),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptAuthentication,
      multi: true,
    },
    CurrencyService,
    HttpClient,
    CountryService,
    GarmentTypeService,
    ToastrService,
    CurrencyConversionService,
    CurrencyExchangeService,
    UnitService,
    StyleDetailsService,
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU' }, // set to AU date format
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        maxWidth: '99vw',
        maxHeight: '95vh',
        AutoFocus: true,
        // disableClose: true,
      },
    }, // set mat dialog options for all dialog
    //   navbarData,
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {},
    },
    {
      provide: COMPONENT_TYPE,
      useValue: {},
      //  useClass: CountryFormComponent,
    },
    {
      provide: 'country',
      useValue: {},
    },

    MatDialogModule,

    // {
    //   provide: IService<GarmentType>,
    //   factory: (T: any): IService<typeof T> => {
    //     if (T instanceof GarmentType) {
    //       //@Inject(GarmentTypeService);
    //     }
    //     return IService<GarmentTypeService>;
    //   },
    // },
    {
      provide: 'defaultSortColumn',
      useValue: 'name',
    },
    {
      provide: SORT_GARMENT_TYPE,
      useValue: 'typename',
    },
    {
      provide: SORT_QUOTE_CURRENCY,
      useValue: 'quoteCurrency',
    },
    {
      provide: SORT_CODE,
      useValue: 'code',
    },
    {
      provide: SORT_ORDER,
      useValue: 'order',
    },
    {
      provide: SORT_ADDRESS,
      useValue: 'id',
    },
    {
      provide: GARMENT_TYPE_SERVICE_PLUGIN,
      useClass: GarmentTypeService,
      //multi: true,
    },
    {
      provide: COUNTRY_SERVICE_PLUGIN,
      useClass: CountryService,
      // multi: true,
    },
    {
      provide: CURRENCY_SERVICE_PLUGIN,
      useClass: CurrencyService,
    },
    {
      provide: PO_SERVICE_PLUGIN,
      useClass: POService,
    },
    {
      provide: BASIS_SERVICE_PLUGIN,
      useClass: BasisService,
    },
    {
      provide: UNIT_SERVICE_PLUGIN,
      useClass: UnitService,
    },
    {
      provide: BANK_SERVICE_PLUGIN,
      useClass: BankService,
    },
    {
      provide: CURRENCY_CONVERSION_SERVICE_PLUGIN,
      useClass: CurrencyConversionService,
    },
    {
      provide: CURRENCY_EXCHANGE_SERVICE_PLUGIN,
      useClass: CurrencyExchangeService,
    },
    {
      provide: STYLE_DETAILS_SERVICE_PLUGIN,
      useClass: StyleDetailsService,
    },
    {
      provide: ADDRESS_SERVICE_PLUGIN,
      useClass: AddressService,
    },
    {
      provide: BUYER_SERVICE_PLUGIN,
      useClass: BuyerService,
    },
    {
      provide: 'form',
      useValue: [],
    },
    {
      provide: 'CountryForm',
      useValue: [
        {
          name: 'name',
          value: 'Sri Lanka',
          validators: ['required', 'maxlength(10)'],
        },
        {
          name: 'code',
          value: 'LK',
          validators: ['required', 'maxlength(3)', 'minlength(2)'],
        },
        {
          name: 'flag',
          value: '',
          validators: ['required'],
        },
      ],
    },
    {
      provide: 'UnitForm',
      useValue: [
        {
          name: 'description',
          value: '',
          validators: ['required', 'maxlength(20)'],
        },
        {
          name: 'code',
          value: 'DOZ',
          validators: ['required', 'maxlength(3)', 'minlength(3)'],
        },
      ],
    },
    {
      provide: 'CurrencyForm',
      useValue: [
        {
          name: 'name',
          value: 'Sri Lankan Ruppee',
          validators: ['required', 'maxlength(10)'],
        },
        {
          name: 'code',
          value: 'LKR',
          validators: ['required', 'maxlength(3)', 'minlength(3)'],
        },
      ],
    },
    {
      provide: FORM_CONTROL_COUNTRY_SERVICE,
      useClass: FormControlService<Country>,
    },
    {
      provide: FORM_CONTROL_CURRENCY_SERVICE,
      useClass: FormControlService<Currency>,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: FORM_FIELD_OPTIONS,
    },
  ],
};
