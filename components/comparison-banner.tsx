import { Trophy } from "lucide-react";
import type { ComparisonResult } from "@/lib/calculations/compare";
import { formatCurrency, formatPercent } from "@/lib/format";

interface ComparisonBannerProps {
  comparison: ComparisonResult;
  winnerName: string;
  loserName: string;
}

export function ComparisonBanner({ comparison, winnerName, loserName }: ComparisonBannerProps) {
  const { winnerTicker, loserTicker, diffValue, diffReturnPct, diffCagr } = comparison;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-etf-a to-etf-b" aria-hidden />

      <div className="flex items-center gap-2 text-sm font-medium text-winner">
        <Trophy className="size-4" />
        {winnerTicker} wins
      </div>

      <p className="mt-2 font-heading text-3xl font-semibold tabular-nums sm:text-4xl">
        {formatCurrency(diffValue)} <span className="text-lg font-medium text-muted-foreground sm:text-xl">more</span>
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {winnerTicker} ({winnerName}) finished {formatCurrency(diffValue)} higher than {loserTicker} ({loserName}).
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:w-fit sm:grid-cols-2 sm:gap-10">
        <div>
          <p className="text-xs text-muted-foreground">Return % difference</p>
          <p className="font-medium tabular-nums">+{formatPercent(Math.abs(diffReturnPct))}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">CAGR difference</p>
          <p className="font-medium tabular-nums">+{formatPercent(Math.abs(diffCagr))}</p>
        </div>
      </div>
    </div>
  );
}
