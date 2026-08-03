export interface PricePoint {
  /** ISO date string, YYYY-MM-DD */
  date: string;
  /** Adjusted close price (splits + dividends factored in) */
  close: number;
}

export interface PriceProvider {
  getHistory(ticker: string): Promise<PricePoint[]>;
}
