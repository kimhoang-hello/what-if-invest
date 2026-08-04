import type { Metadata } from "next";
import { BackLink } from "@/components/resources/back-link";
import { AllocationBreakdownExplorer } from "@/components/resources/allocation-breakdown";

export const metadata: Metadata = {
  title: "Asset Allocation Finder — What If Invest",
  description: "See what's actually inside each Canadian all-in-one ETF or mutual fund — holdings mix and fee.",
};

export default function AssetAllocationFinderPage() {
  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Resources</p>
        <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">Asset Allocation Finder</h1>
        <p className="max-w-xl text-muted-foreground">
          Each all-in-one ETF or mutual fund is really a mix of other funds. Pick one to see roughly what it holds
          and what it costs.
        </p>
      </div>

      <AllocationBreakdownExplorer />
    </div>
  );
}
