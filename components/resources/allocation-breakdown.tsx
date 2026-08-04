"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { ALLOCATION_BREAKDOWNS, type AllocationBreakdown } from "@/lib/data/allocation-breakdowns";
import { getEtfMeta } from "@/lib/data/etf-list";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const TICKER_ORDER = ["XEQT", "VEQT", "XGRO", "VGRO", "XBAL", "VBAL", "TDB900"];

type PctKey = Exclude<keyof AllocationBreakdown, "ticker" | "merPct" | "researchUrl">;

const CATEGORIES: { key: PctKey; label: string; color: string }[] = [
  { key: "canadianEquityPct", label: "Canadian equity", color: "var(--cat-1)" },
  { key: "usEquityPct", label: "US equity", color: "var(--cat-2)" },
  { key: "internationalEquityPct", label: "International equity", color: "var(--cat-3)" },
  { key: "emergingMarketsPct", label: "Emerging markets", color: "var(--cat-4)" },
  { key: "fixedIncomePct", label: "Fixed income (bonds)", color: "var(--cat-5)" },
];

export function AllocationBreakdownExplorer() {
  const [ticker, setTicker] = useState("XEQT");
  const breakdown = ALLOCATION_BREAKDOWNS[ticker];
  const meta = getEtfMeta(ticker);

  return (
    <Card className="rounded-3xl">
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {TICKER_ORDER.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTicker(t)}
              className={cn(
                "rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition-colors",
                ticker === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-foreground hover:border-primary/50"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {breakdown && (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Approximate target allocation</p>
                <h3 className="font-heading text-lg font-semibold">{meta?.name ?? ticker}</h3>
                <a
                  href={breakdown.researchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Research {ticker} yourself
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-muted-foreground">MER</p>
                <p className="font-heading text-lg font-semibold tabular-nums">{breakdown.merPct.toFixed(2)}%</p>
              </div>
            </div>

            <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${ticker} asset allocation`}>
              {CATEGORIES.map(({ key, label, color }) => {
                const pct = breakdown[key];
                if (pct <= 0) return null;
                return <div key={key} title={`${label}: ${pct}%`} style={{ width: `${pct}%`, backgroundColor: color }} />;
              })}
            </div>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              {CATEGORIES.map(({ key, label, color }) => {
                const pct = breakdown[key];
                if (pct <= 0) return null;
                return (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden />
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="ml-auto font-medium tabular-nums">{pct}%</dd>
                  </div>
                );
              })}
            </dl>

            <p className="text-xs text-muted-foreground">
              Approximate long-term target allocation and MER based on the issuer&apos;s published policy, not a
              live snapshot — fees and weights do change, so check the fund&apos;s current fact sheet for exact
              figures.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
