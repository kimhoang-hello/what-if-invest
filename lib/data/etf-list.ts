export type EtfCategory =
  | "us-broad-equity"
  | "us-growth"
  | "us-dividend"
  | "international-developed"
  | "emerging-markets"
  | "bonds"
  | "ca-all-equity"
  | "ca-growth-allocation"
  | "ca-balanced-allocation";

export type AssetType = "etf" | "mutual-fund";

export interface EtfMeta {
  ticker: string;
  name: string;
  category: EtfCategory;
  assetType: AssetType;
  /** Approximate real-world inception date, used to size the mock history and demo overlap-clamping */
  launchDate: string;
  /** Trading venue for real-data lookups (e.g. Twelve Data's `exchange` param). Omitted = primary US exchange. */
  exchange?: string;
}

export const ETF_LIST: EtfMeta[] = [
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", category: "us-broad-equity", assetType: "etf", launchDate: "2010-09-09" },
  { ticker: "VTI", name: "Vanguard Total Stock Market ETF", category: "us-broad-equity", assetType: "etf", launchDate: "2001-05-24" },
  { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", category: "us-broad-equity", assetType: "etf", launchDate: "1993-01-29" },
  { ticker: "IVV", name: "iShares Core S&P 500 ETF", category: "us-broad-equity", assetType: "etf", launchDate: "2000-05-15" },
  { ticker: "QQQ", name: "Invesco QQQ Trust", category: "us-growth", assetType: "etf", launchDate: "1999-03-10" },
  { ticker: "SCHD", name: "Schwab U.S. Dividend Equity ETF", category: "us-dividend", assetType: "etf", launchDate: "2011-10-20" },
  { ticker: "VYM", name: "Vanguard High Dividend Yield ETF", category: "us-dividend", assetType: "etf", launchDate: "2006-11-10" },
  { ticker: "VXUS", name: "Vanguard Total International Stock ETF", category: "international-developed", assetType: "etf", launchDate: "2011-01-26" },
  { ticker: "VEA", name: "Vanguard FTSE Developed Markets ETF", category: "international-developed", assetType: "etf", launchDate: "2007-07-20" },
  { ticker: "VWO", name: "Vanguard FTSE Emerging Markets ETF", category: "emerging-markets", assetType: "etf", launchDate: "2005-03-04" },
  { ticker: "BND", name: "Vanguard Total Bond Market ETF", category: "bonds", assetType: "etf", launchDate: "2007-04-03" },
  { ticker: "AGG", name: "iShares Core U.S. Aggregate Bond ETF", category: "bonds", assetType: "etf", launchDate: "2003-09-22" },
  { ticker: "XEQT", name: "iShares Core Equity ETF Portfolio", category: "ca-all-equity", assetType: "etf", launchDate: "2019-08-07", exchange: "TSX" },
  { ticker: "VEQT", name: "Vanguard All-Equity ETF Portfolio", category: "ca-all-equity", assetType: "etf", launchDate: "2019-01-29", exchange: "TSX" },
  { ticker: "XGRO", name: "iShares Core Growth ETF Portfolio", category: "ca-growth-allocation", assetType: "etf", launchDate: "2018-01-25", exchange: "TSX" },
  { ticker: "VGRO", name: "Vanguard Growth ETF Portfolio", category: "ca-growth-allocation", assetType: "etf", launchDate: "2018-01-25", exchange: "TSX" },
  { ticker: "XBAL", name: "iShares Core Balanced ETF Portfolio", category: "ca-balanced-allocation", assetType: "etf", launchDate: "2018-01-25", exchange: "TSX" },
  { ticker: "VBAL", name: "Vanguard Balanced ETF Portfolio", category: "ca-balanced-allocation", assetType: "etf", launchDate: "2018-01-25", exchange: "TSX" },

  // Mutual funds — selectable only for ETF/Mutual Fund #2, so a beginner can
  // compare a low-cost ETF against the equivalent mutual fund share class.
  { ticker: "VFIAX", name: "Vanguard 500 Index Fund Admiral Shares", category: "us-broad-equity", assetType: "mutual-fund", launchDate: "2000-11-13" },
  { ticker: "VTSAX", name: "Vanguard Total Stock Market Index Fund Admiral Shares", category: "us-broad-equity", assetType: "mutual-fund", launchDate: "2000-11-13" },
  { ticker: "FXAIX", name: "Fidelity 500 Index Fund", category: "us-broad-equity", assetType: "mutual-fund", launchDate: "1988-02-17" },
  { ticker: "SWPPX", name: "Schwab S&P 500 Index Fund", category: "us-broad-equity", assetType: "mutual-fund", launchDate: "1997-05-19" },
  { ticker: "FCNTX", name: "Fidelity Contrafund", category: "us-growth", assetType: "mutual-fund", launchDate: "1967-05-17" },
  { ticker: "VDIGX", name: "Vanguard Dividend Growth Fund", category: "us-dividend", assetType: "mutual-fund", launchDate: "1992-05-15" },
  { ticker: "VTIAX", name: "Vanguard Total International Stock Index Fund Admiral Shares", category: "international-developed", assetType: "mutual-fund", launchDate: "2010-11-29" },
  { ticker: "VEMAX", name: "Vanguard Emerging Markets Stock Index Fund Admiral Shares", category: "emerging-markets", assetType: "mutual-fund", launchDate: "2011-05-25" },
  { ticker: "VBTLX", name: "Vanguard Total Bond Market Index Fund Admiral Shares", category: "bonds", assetType: "mutual-fund", launchDate: "2001-11-12" },
  { ticker: "TDB900", name: "TD Canadian Index Fund - e-Series", category: "ca-all-equity", assetType: "mutual-fund", launchDate: "2000-11-01" },
];

export const ETF_ONLY_LIST: EtfMeta[] = ETF_LIST.filter((fund) => fund.assetType === "etf");

export function getEtfMeta(ticker: string): EtfMeta | undefined {
  return ETF_LIST.find((etf) => etf.ticker === ticker.toUpperCase());
}
