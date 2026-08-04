import type { PriceProvider } from "@/lib/data/types";
import { MockPriceProvider } from "@/lib/data/providers/mock";

/**
 * Active price data provider. Every fund in this app is TSX-listed or a TD
 * e-Series mutual fund — neither is covered by a free-tier market data API
 * (confirmed for Twelve Data: TSX symbols require a paid plan), so this runs
 * entirely on generated demo data for now. Swap to a real vendor by writing
 * a new adapter in lib/data/providers/ (implementing PriceProvider) and
 * changing this line — no other code depends on the vendor.
 */
export const priceProvider: PriceProvider = new MockPriceProvider();

export * from "@/lib/data/types";
export * from "@/lib/data/etf-list";
