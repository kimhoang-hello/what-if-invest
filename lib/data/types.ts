export interface PricePoint {
  /** ISO date string, YYYY-MM-DD */
  date: string;
  /** Adjusted close price (splits + dividends factored in) */
  close: number;
}

export type DataSource = "real" | "mock";

export interface PriceHistory {
  points: PricePoint[];
  source: DataSource;
}

export interface PriceProvider {
  getHistory(ticker: string): Promise<PriceHistory>;
}
