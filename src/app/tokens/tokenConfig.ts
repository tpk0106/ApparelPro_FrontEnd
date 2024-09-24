import { InjectionToken } from '@angular/core';
import { GarmentType } from '../Models/References/GarmentType';
import { Country } from '../Models/References/Country';
import { Currency } from '../Models/References/Currency';
import { InjectorService } from '../Services/InjectorService';
import { PurchaseOrder } from '../Models/OrderManagement/PurchaseOrder';
import { Buyer } from '../Models/References/Buyer';
import { Basis } from '../Models/References/Basis';
import { CurrencyConversion } from '../Models/References/CurrencyConversion';
import { CurrencyExchange } from '../Models/References/CurrencyExchange';
import { FormControlService } from '../common/form-control.service';
import { Unit } from '../Models/References/Unit';
import { Bank } from '../Models/References/Bank';
import { Style } from '../Models/OrderManagement/Style';
import { Address } from '../Models/References/Address';

export const GARMENT_TYPE_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<GarmentType>
>('GarmentType.service.plugin');

export const COUNTRY_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<Country>
>('country.service.plugin');

export const CURRENCY_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<Currency>
>('currency.service.plugin');

export const PO_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<PurchaseOrder>
>('po.service.plugin');

export const BUYER_SERVICE_PLUGIN = new InjectionToken<InjectorService<Buyer>>(
  'buyer.service.plugin'
);

export const BASIS_SERVICE_PLUGIN = new InjectionToken<InjectorService<Basis>>(
  'basis.service.plugin'
);

export const BANK_SERVICE_PLUGIN = new InjectionToken<InjectorService<Bank>>(
  'basis.service.plugin'
);

export const CURRENCY_CONVERSION_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<CurrencyConversion>
>('currencyconversion.service.plugin');

export const CURRENCY_EXCHANGE_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<CurrencyExchange>
>('currencyexchange.service.plugin');

export const UNIT_SERVICE_PLUGIN = new InjectionToken<InjectorService<Unit>>(
  'unit.service.plugin'
);

export const STYLE_DETAILS_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<Style>
>('style.details.service.plugin');

export const ADDRESS_SERVICE_PLUGIN = new InjectionToken<
  InjectorService<Address>
>('address.details.service.plugin');

// export const BUYERDDRESS_SERVICE_PLUGIN = new InjectionToken<
//   InjectorService<Address>
// >('address.details.service.plugin');

export const COMPONENT_TYPE = new InjectionToken<any>('component-type');
//export const COMPONENT_TYPE = new InjectionToken<any>('component-type');

export const FORM_CONTROL_COUNTRY_SERVICE = new InjectionToken<
  FormControlService<Country>
>('country.form.control.service');

export const FORM_CONTROL_CURRENCY_SERVICE = new InjectionToken<
  FormControlService<Currency>
>('country.form.control.service');

export const FORM_CONTROL_UNIT_SERVICE = new InjectionToken<
  FormControlService<Unit>
>('unit.form.control.service');

export const Form_Control_Service_Country = new InjectionToken<
  FormControlService<Country>
>('fcs_country');

// constant

// export const SORT_GARMENT_TYPE: string = 'garmentType';
// export const SORT_QUOTE_CURRENCY: string = 'quoteCurrency';
// export const SORT_CODE: string = 'code';
