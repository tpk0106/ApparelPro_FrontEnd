import { Country } from './Country';

export interface Currency {
  id: number;
  code: string;
  name: string;
  country: Country;
  countryCode: string;
  minor: string;
}
