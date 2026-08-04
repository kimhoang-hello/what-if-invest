"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { inputsToSearchParams, searchParamsToInputs, type ComparisonInputs } from "@/lib/comparison-state";
import {
  getRecentComparisonsServerSnapshot,
  getRecentComparisonsSnapshot,
  saveRecentComparison,
  subscribeRecentComparisons,
} from "@/lib/recent-comparisons";
import { useEtfPrices } from "@/hooks/use-etf-prices";
import { resolveDateRange } from "@/lib/calculations/overlap";
import { simulatePortfolio } from "@/lib/calculations/simulate-portfolio";
import { computeReturns } from "@/lib/calculations/returns";
import { compareResults } from "@/lib/calculations/compare";
import { getEtfMeta, ETF_LIST, ETF_ONLY_LIST } from "@/lib/data/etf-list";
import { DataSourceNote } from "@/components/data-source-note";
import { InvestmentForm } from "@/components/investment-form";
import { ResultsSummary } from "@/components/results-summary";
import { ComparisonBanner } from "@/components/comparison-banner";
import { SummaryCard } from "@/components/summary-card";
import { PortfolioValueChart } from "@/components/charts/portfolio-value-chart";
import { ContributionGrowthChart } from "@/components/charts/contribution-growth-chart";
import { ResultsSkeleton } from "@/components/loading-skeleton";
import { ErrorState } from "@/components/error-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SYNC_DELAY_MS = 500;

export function ComparisonApp() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputs, setInputs] = useState<ComparisonInputs>(() => searchParamsToInputs(searchParams));
  const recent = useSyncExternalStore(
    subscribeRecentComparisons,
    getRecentComparisonsSnapshot,
    getRecentComparisonsServerSnapshot
  );

  const handleChange = useCallback((patch: Partial<ComparisonInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  }, []);

  // ETF #1 only ever holds an ETF, so swapping is blocked when #2 holds a
  // mutual fund (it would otherwise land a mutual fund in the ETF-only slot).
  const canSwap = getEtfMeta(inputs.etfB)?.assetType === "etf";

  const handleSwap = useCallback(() => {
    setInputs((prev) => (getEtfMeta(prev.etfB)?.assetType === "etf" ? { ...prev, etfA: prev.etfB, etfB: prev.etfA } : prev));
  }, []);

  const handleRandom = useCallback(() => {
    const a = ETF_ONLY_LIST[Math.floor(Math.random() * ETF_ONLY_LIST.length)];
    let b = ETF_LIST[Math.floor(Math.random() * ETF_LIST.length)];
    while (b.ticker === a.ticker) {
      b = ETF_LIST[Math.floor(Math.random() * ETF_LIST.length)];
    }
    setInputs((prev) => ({ ...prev, etfA: a.ticker, etfB: b.ticker }));
  }, []);

  const sameTicker = inputs.etfA === inputs.etfB;
  const invalidInitial = !(inputs.initialInvestment > 0);

  const { prices: pricesA, source: sourceA, isLoading: loadingA, error: errorA, retry: retryA } = useEtfPrices(inputs.etfA);
  const { prices: pricesB, source: sourceB, isLoading: loadingB, error: errorB, retry: retryB } = useEtfPrices(inputs.etfB);

  const canCompute = !sameTicker && !invalidInitial && !!pricesA && !!pricesB;

  const computed = useMemo(() => {
    if (!canCompute || !pricesA || !pricesB) return null;
    try {
      const range = resolveDateRange(inputs.period, inputs.etfA, pricesA, inputs.etfB, pricesB);
      const simA = simulatePortfolio({
        prices: pricesA,
        startDate: range.startDate,
        endDate: range.endDate,
        initialInvestment: inputs.initialInvestment,
        contributionAmount: inputs.contributionAmount,
        frequency: inputs.frequency,
        annualIncreasePct: inputs.annualIncreasePct,
      });
      const simB = simulatePortfolio({
        prices: pricesB,
        startDate: range.startDate,
        endDate: range.endDate,
        initialInvestment: inputs.initialInvestment,
        contributionAmount: inputs.contributionAmount,
        frequency: inputs.frequency,
        annualIncreasePct: inputs.annualIncreasePct,
      });
      const metricsA = computeReturns(simA);
      const metricsB = computeReturns(simB);
      const comparison = compareResults({
        tickerA: inputs.etfA,
        metricsA,
        tickerB: inputs.etfB,
        metricsB,
        contributionAmount: inputs.contributionAmount,
        frequency: inputs.frequency,
        period: inputs.period,
      });
      return { range, simA, simB, metricsA, metricsB, comparison };
    } catch {
      return null;
    }
  }, [canCompute, pricesA, pricesB, inputs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = inputsToSearchParams(inputs);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      if (computed) {
        saveRecentComparison(inputs);
      }
    }, SYNC_DELAY_MS);
    return () => clearTimeout(timer);
  }, [inputs, computed, pathname, router]);

  const metaA = getEtfMeta(inputs.etfA);
  const metaB = getEtfMeta(inputs.etfB);

  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
          Compare two ETFs.
          <br />
          See who wins.
        </h1>
        <p className="max-w-md text-muted-foreground">
          Pick two ETFs and an investing habit — we&apos;ll simulate dollar-cost averaging into both and show you the difference.
        </p>
        <DataSourceNote />
      </div>

      <Card className="rounded-3xl">
        <CardContent className="p-5 sm:p-6">
          <InvestmentForm inputs={inputs} onChange={handleChange} onSwap={handleSwap} onRandom={handleRandom} canSwap={canSwap} />
        </CardContent>
      </Card>

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Recent:</span>
          {recent.map((r) => (
            <Button
              key={`${r.etfA}-${r.etfB}-${r.savedAt}`}
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setInputs({ ...r })}
            >
              {r.etfA} vs {r.etfB}
            </Button>
          ))}
        </div>
      )}

      {sameTicker && (
        <InlineNotice text="Pick two different ETFs to compare." />
      )}
      {invalidInitial && !sameTicker && (
        <InlineNotice text="Enter an initial investment greater than $0." />
      )}

      {!sameTicker && !invalidInitial && (loadingA || loadingB) && <ResultsSkeleton />}

      {!sameTicker && !invalidInitial && (errorA || errorB) && (
        <ErrorState
          message={`We couldn't load price data for ${errorA ? inputs.etfA : inputs.etfB}.`}
          onRetry={() => {
            if (errorA) retryA();
            if (errorB) retryB();
          }}
        />
      )}

      {computed && metaA && metaB && (
        <div className="flex flex-col gap-8">
          {computed.range.clamped && computed.range.message && <InlineNotice text={computed.range.message} />}

          <ComparisonBanner
            comparison={computed.comparison}
            winnerName={(computed.comparison.winnerTicker === inputs.etfA ? metaA : metaB).name}
            loserName={(computed.comparison.loserTicker === inputs.etfA ? metaA : metaB).name}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ResultsSummary
              ticker={inputs.etfA}
              name={metaA.name}
              accent="a"
              metrics={computed.metricsA}
              isWinner={computed.comparison.winnerTicker === inputs.etfA}
              source={sourceA}
            />
            <ResultsSummary
              ticker={inputs.etfB}
              name={metaB.name}
              accent="b"
              metrics={computed.metricsB}
              isWinner={computed.comparison.winnerTicker === inputs.etfB}
              source={sourceB}
            />
          </div>

          <SummaryCard summary={computed.comparison.summary} />

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">Portfolio value over time</h2>
            <Card className="rounded-3xl">
              <CardContent className="p-4 sm:p-5">
                <PortfolioValueChart simA={computed.simA} simB={computed.simB} tickerA={inputs.etfA} tickerB={inputs.etfB} />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">Contribution vs. growth</h2>
            <Card className="rounded-3xl">
              <CardContent className="p-4 sm:p-5">
                <ContributionGrowthChart
                  tickerA={inputs.etfA}
                  metricsA={computed.metricsA}
                  tickerB={inputs.etfB}
                  metricsB={computed.metricsB}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

function InlineNotice({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
      <AlertCircle className="size-4 shrink-0 text-muted-foreground" />
      {text}
    </div>
  );
}
