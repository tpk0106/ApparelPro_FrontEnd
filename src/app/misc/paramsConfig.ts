import { Component, InjectionToken, Type } from '@angular/core';

export const APPAREL_PRO_UI_PARAMS = {
  paging: {
    pageSize: 10,
    pageIndex: 0,
  },
  filtering: {
    defaultFilterColumn: 'name',
  },
  sorting: {
    defaultSortColumn: 'name',
    defaultSortOrder: 'desc' || 'desc',
  },
};

export const COMPONENT_TYPE: InjectionToken<Component> =
  new InjectionToken<Component>(
    'component type'
    //   {
    //   // factory: () => {
    //   //   const token = 'xx';
    //   //   return token;
    //   // },
    // }
  );
// https://nartc.me/blog/inheritance-angular-inject/?utm_source=pocket_shared
// https://www.damirscorner.com/blog/posts/20211015-InterfacesInAngularDependencyInjection.html?utm_source=pocket_shared

// export const Service_Token: InjectionToken<IService<T>> = new InjectionToken<
//   IService<T>
// >(
//   'service type'
//   //   ,{

//   // }
// );

export const SORT_GARMENT_TYPE: string = 'garmentType';
export const SORT_QUOTE_CURRENCY: string = 'quoteCurrency';
export const SORT_CODE: string = 'code';
export const SORT_ORDER: string = 'order';
export const SORT_ADDRESS: string = 'id';

// formoptions
export const FORM_FIELD_OPTIONS = {
  appearnce: 'outline',
  //floatLabel: 'always',
  //hideRequiredMarker: true,
};

//export const BUYER_STATUS = 'BO' || 'NP' || 'BC' || 'AG';

// export enum BUYER_STATUS {
//   'BO' = 'Buying Office',
//   'NP' = 'Notify Party',
//   'AG' = 'Agent',
//   'BC' = 'Buyer Consignee',
// }
