import useSWR from "swr";
import type { PricePoint } from "@/lib/data/types";

interface PricesResponse {
  ticker: string;
  prices: PricePoint[];
}

async function fetcher(url: string): Promise<PricesResponse> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export function useEtfPrices(ticker: string | null) {
  const { data, error, isLoading, mutate } = useSWR<PricesResponse>(
    ticker ? `/api/prices/${ticker}` : null,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  return {
    prices: data?.prices ?? null,
    isLoading,
    error: error as Error | undefined,
    retry: () => mutate(),
  };
}
