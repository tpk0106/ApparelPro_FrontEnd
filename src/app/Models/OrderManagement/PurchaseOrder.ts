export interface PurchaseOrder {
  buyerCode: number;
  buyer: string;
  order: string;
  orderDate: Date;
  garmentType: number;
  garmentTypeName: string;
  countryCode: string;
  unitCode: string;
  totalQuantity: number;
  currencyCode: string;
  season: string;
  basisCode: string;
  basisValue: number;
}
