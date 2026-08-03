"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReturnMetrics } from "@/lib/calculations/types";
import { formatCurrency } from "@/lib/format";
import { ChartTooltipContent } from "@/components/charts/chart-tooltip";

interface ContributionGrowthChartProps {
  tickerA: string;
  metricsA: ReturnMetrics;
  tickerB: string;
  metricsB: ReturnMetrics;
}

function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function ContributionGrowthChart({ tickerA, metricsA, tickerB, metricsB }: ContributionGrowthChartProps) {
  const data = useMemo(
    () => [
      { ticker: tickerA, Contributed: metricsA.totalContributions, Growth: metricsA.gain },
      { ticker: tickerB, Contributed: metricsB.totalContributions, Growth: metricsB.gain },
    ],
    [tickerA, metricsA, tickerB, metricsB]
  );

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="ticker"
            tick={{ fontSize: 13, fill: "var(--foreground)", fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip content={<ChartTooltipContent valueFormatter={(v) => formatCurrency(v)} />} cursor={{ fill: "var(--muted)" }} />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }} />
          <Bar dataKey="Contributed" stackId="stack" fill="var(--muted-foreground)" fillOpacity={0.35} radius={[0, 0, 6, 6]} maxBarSize={72} />
          <Bar dataKey="Growth" stackId="stack" fill="var(--winner)" radius={[6, 6, 0, 0]} maxBarSize={72} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
