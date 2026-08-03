import type { PriceProvider } from "@/lib/data/types";
import { MockPriceProvider } from "@/lib/data/providers/mock";

/**
 * Active price data provider. Swap to a real vendor by writing a new adapter
 * in lib/data/providers/ (implementing PriceProvider) and changing this line
 * — no other code depends on the vendor.
 */
export const priceProvider: PriceProvider = new MockPriceProvider();

export * from "@/lib/data/types";
export * from "@/lib/data/etf-list";
