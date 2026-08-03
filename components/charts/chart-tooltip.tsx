interface TooltipPayloadEntry {
  dataKey?: string | number;
  name?: string;
  value?: number;
  color?: string;
}

interface ChartTooltipContentProps {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadEntry[];
  valueFormatter: (value: number) => string;
  labelFormatter?: (label: string) => string;
}

export function ChartTooltipContent({ active, label, payload, valueFormatter, labelFormatter }: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-sm shadow-md">
      {label && <p className="mb-1.5 text-xs text-muted-foreground">{labelFormatter ? labelFormatter(label) : label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center gap-2">
            <span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-medium tabular-nums">
              {typeof entry.value === "number" ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
