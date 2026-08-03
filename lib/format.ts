export function formatCurrency(value: number, opts: { maximumFractionDigits?: number } = {}): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts.maximumFractionDigits ?? 0,
  }).format(value);
}

export function formatPercent(value: number, opts: { maximumFractionDigits?: number } = {}): string {
  const digits = opts.maximumFractionDigits ?? 1;
  return `${value.toFixed(digits)}%`;
}

export function formatMultiple(value: number): string {
  return `${value.toFixed(1)}x`;
}

export function formatNumber(value: number, opts: { maximumFractionDigits?: number } = {}): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: opts.maximumFractionDigits ?? 2,
  }).format(value);
}

/** Comma-grouped display value for a controlled numeric text input, e.g. 10000 -> "10,000". */
export function formatInputNumber(value: number): string {
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

/** Inverse of formatInputNumber: strips grouping characters typed/pasted into the field. */
export function parseInputNumber(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}
