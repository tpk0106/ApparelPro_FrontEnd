import { Component, Type } from '@angular/core';
import { CountryFormComponent } from '../references/country/country-form.component';

export class ComponentFactory {
  static getComponent(type: any): typeof type {
    switch (type) {
      case typeof CountryFormComponent:
        return CountryFormComponent;
      default:
        break;
    }
    return;
  }
}
