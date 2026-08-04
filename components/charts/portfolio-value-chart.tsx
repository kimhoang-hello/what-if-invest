"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SimulationResult } from "@/lib/calculations/types";
import { mergeSeriesByDate } from "@/lib/calculations/merge-series";
import { downsample } from "@/lib/calculations/downsample";
import { formatCurrency } from "@/lib/format";
import { ChartTooltipContent } from "@/components/charts/chart-tooltip";

interface PortfolioValueChartProps {
  simA: SimulationResult;
  simB: SimulationResult;
  tickerA: string;
  tickerB: string;
}

function formatAxisDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

function formatFullDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

/** A rounded pill handle (instead of Recharts' default thin bar) matching the app's pill-button style. */
function BrushHandle({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const cx = x + width / 2;
  return (
    <g style={{ cursor: "ew-resize" }}>
      <rect x={x} y={y} width={width} height={height} rx={width / 2} fill="var(--primary)" />
      {[-1.5, 1.5].map((dx) => (
        <line
          key={dx}
          x1={cx + dx}
          y1={y + height * 0.3}
          x2={cx + dx}
          y2={y + height * 0.7}
          stroke="var(--primary-foreground)"
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
    </g>
  );
}

export function PortfolioValueChart({ simA, simB, tickerA, tickerB }: PortfolioValueChartProps) {
  const data = useMemo(() => {
    const merged = mergeSeriesByDate(simA.series, simB.series);
    const sampled = downsample(merged, 500);
    return sampled.map((point) => ({
      date: point.date,
      [tickerA]: point.a?.value ?? null,
      [tickerB]: point.b?.value ?? null,
    }));
  }, [simA.series, simB.series, tickerA, tickerB]);

  return (
    <div className="w-full">
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              minTickGap={48}
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
            <Tooltip
              content={
                <ChartTooltipContent valueFormatter={(v) => formatCurrency(v)} labelFormatter={formatFullDate} />
              }
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
            />
            <Area
              type="monotone"
              dataKey={tickerA}
              name={tickerA}
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillA)"
              dot={false}
              connectNulls
              isAnimationActive
            />
            <Area
              type="monotone"
              dataKey={tickerB}
              name={tickerB}
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#fillB)"
              dot={false}
              connectNulls
              isAnimationActive
            />
            <Brush
              dataKey="date"
              height={28}
              travellerWidth={12}
              stroke="var(--muted-foreground)"
              fill="var(--muted)"
              tickFormatter={formatAxisDate}
              traveller={BrushHandle}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1.5 text-center text-xs text-muted-foreground">
        Drag the handles below the chart to zoom into a date range.
      </p>
    </div>
  );
}
