import { Buyer } from './Buyer';

export interface Address {
  id: number;
  addressId: any;
  streetAddress: string;
  addressType: number;
  city: string;
  postCode: number;
  state: string;
  countryCode: string;
  country: string;
  default: boolean;
  buyer: Buyer;
  buyerCode: number;
}
