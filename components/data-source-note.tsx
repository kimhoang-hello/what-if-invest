import { Info } from "lucide-react";

export function DataSourceNote() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-muted px-3.5 py-1.5 text-xs text-muted-foreground">
      <Info className="size-3.5 shrink-0" />
      <span>
        Prices come from Twelve Data where available. Funds marked <span className="font-medium">Simulated</span>{" "}
        below use generated demo data because live data isn&apos;t available for them.
      </span>
    </div>
  );
}
