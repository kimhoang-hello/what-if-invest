import type { PriceProvider } from "@/lib/data/types";
import { MockPriceProvider } from "@/lib/data/providers/mock";
import { TwelveDataPriceProvider } from "@/lib/data/providers/twelve-data";

/**
 * Active price data provider. Swap to a different vendor by writing a new
 * adapter in lib/data/providers/ (implementing PriceProvider) and changing
 * this file — no other code depends on the vendor.
 *
 * Uses real data from Twelve Data when TWELVE_DATA_API_KEY is set (see
 * .env.example), otherwise falls back to the mock generator so the app keeps
 * working with zero setup.
 */
const apiKey = process.env.TWELVE_DATA_API_KEY;

export const priceProvider: PriceProvider = apiKey ? new TwelveDataPriceProvider(apiKey) : new MockPriceProvider();

export * from "@/lib/data/types";
export * from "@/lib/data/etf-list";
