import type { ReturnMetrics, SimulationResult } from "@/lib/calculations/types";
import { xirr } from "@/lib/calculations/xirr";

export function computeReturns(sim: SimulationResult): ReturnMetrics {
  const { finalValue, totalContributed, totalShares, cashFlows } = sim;
  const gain = finalValue - totalContributed;

  return {
    finalValue,
    totalContributions: totalContributed,
    gain,
    totalReturnPct: totalContributed > 0 ? (gain / totalContributed) * 100 : 0,
    cagr: xirr(cashFlows) * 100,
    growthMultiple: totalContributed > 0 ? finalValue / totalContributed : 0,
    totalShares,
  };
}
