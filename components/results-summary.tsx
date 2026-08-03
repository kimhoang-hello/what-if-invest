import { Trophy } from "lucide-react";
import type { ReturnMetrics } from "@/lib/calculations/types";
import type { DataSource } from "@/lib/data/types";
import { formatCurrency, formatMultiple, formatNumber, formatPercent } from "@/lib/format";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ResultsSummaryProps {
  ticker: string;
  name: string;
  accent: "a" | "b";
  metrics: ReturnMetrics;
  isWinner: boolean;
  source?: DataSource;
}

export function ResultsSummary({ ticker, name, accent, metrics, isWinner, source }: ResultsSummaryProps) {
  const accentBorder = accent === "a" ? "border-t-etf-a" : "border-t-etf-b";
  const accentBg = accent === "a" ? "bg-etf-a" : "bg-etf-b";

  return (
    <Card className={cn("gap-4 rounded-3xl border-t-4 py-5", accentBorder, isWinner && "ring-2 ring-winner/40")}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 px-5">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", accentBg)} aria-hidden />
            <span className="font-heading text-lg font-semibold">{ticker}</span>
            {isWinner && (
              <Badge className="gap-1 border-none bg-winner/15 text-winner">
                <Trophy className="size-3" />
                Winner
              </Badge>
            )}
            {source === "mock" && (
              <Badge variant="outline" className="text-muted-foreground">
                Simulated
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-5">
        <div>
          <p className="text-xs text-muted-foreground">Final portfolio value</p>
          <p className="font-heading text-3xl font-semibold tabular-nums">
            {formatCurrency(metrics.finalValue)}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4 text-sm">
          <Stat label="Total contributions" value={formatCurrency(metrics.totalContributions)} />
          <Stat
            label="Investment gain"
            value={`${metrics.gain >= 0 ? "+" : ""}${formatCurrency(metrics.gain)}`}
            positive={metrics.gain >= 0}
          />
          <Stat
            label="Total return"
            value={`${metrics.totalReturnPct >= 0 ? "+" : ""}${formatPercent(metrics.totalReturnPct)}`}
            positive={metrics.totalReturnPct >= 0}
          />
          <Stat
            label="Annualized return (CAGR)"
            value={`${metrics.cagr >= 0 ? "+" : ""}${formatPercent(metrics.cagr)}`}
            positive={metrics.cagr >= 0}
          />
          <Stat label="Shares owned" value={formatNumber(metrics.totalShares, { maximumFractionDigits: 3 })} />
          <Stat label="Growth multiple" value={formatMultiple(metrics.growthMultiple)} />
        </dl>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "font-medium tabular-nums",
          positive === true && "text-winner",
          positive === false && "text-destructive"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
