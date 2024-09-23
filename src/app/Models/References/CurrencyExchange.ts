export interface CurrencyExchange {
  id: number;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  exchangeDate: Date;
}
