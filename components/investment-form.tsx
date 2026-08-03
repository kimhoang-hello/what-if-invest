"use client";

import { ArrowLeftRight, Shuffle } from "lucide-react";
import type { ComparisonInputs } from "@/lib/comparison-state";
import type { ContributionFrequency, InvestmentPeriod } from "@/lib/calculations/types";
import { FREQUENCY_LABELS, PERIOD_LABELS } from "@/lib/calculations/labels";
import { ETF_LIST, ETF_ONLY_LIST } from "@/lib/data/etf-list";
import { formatInputNumber, parseInputNumber } from "@/lib/format";
import { EtfSelector } from "@/components/etf-selector";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const FREQUENCIES: ContributionFrequency[] = ["none", "daily", "weekly", "biweekly", "monthly", "quarterly", "yearly"];
const PERIODS: InvestmentPeriod[] = ["1y", "3y", "5y", "10y", "15y", "20y", "max"];

interface InvestmentFormProps {
  inputs: ComparisonInputs;
  onChange: (patch: Partial<ComparisonInputs>) => void;
  onSwap: () => void;
  onRandom: () => void;
  canSwap: boolean;
}

export function InvestmentForm({ inputs, onChange, onSwap, onRandom, canSwap }: InvestmentFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <EtfSelector
          label="ETF #1"
          value={inputs.etfA}
          onChange={(etfA) => onChange({ etfA })}
          accent="a"
          disabledTicker={inputs.etfB}
          pool={ETF_ONLY_LIST}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="mx-auto rounded-full sm:mb-[3px]"
          aria-label="Swap ETFs"
          title={canSwap ? undefined : "Can't swap — ETF #1 can only hold an ETF"}
          disabled={!canSwap}
          onClick={onSwap}
        >
          <ArrowLeftRight className="size-4" />
        </Button>
        <EtfSelector
          label="ETF or Mutual Fund #2"
          value={inputs.etfB}
          onChange={(etfB) => onChange({ etfB })}
          accent="b"
          disabledTicker={inputs.etfA}
          pool={ETF_LIST}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="initial-investment" className="text-xs font-medium text-muted-foreground">
            Initial investment
          </Label>
          <InputGroup className="h-11 rounded-2xl px-1">
            <InputGroupAddon>
              <InputGroupText className="text-foreground">$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="initial-investment"
              type="text"
              inputMode="decimal"
              value={formatInputNumber(inputs.initialInvestment)}
              onChange={(e) => onChange({ initialInvestment: parseInputNumber(e.target.value) })}
              className="text-base font-medium"
            />
          </InputGroup>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contribution-amount" className="text-xs font-medium text-muted-foreground">
            Contribution amount
          </Label>
          <InputGroup className="h-11 rounded-2xl px-1">
            <InputGroupAddon>
              <InputGroupText className="text-foreground">$</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="contribution-amount"
              type="text"
              inputMode="decimal"
              disabled={inputs.frequency === "none"}
              value={formatInputNumber(inputs.contributionAmount)}
              onChange={(e) => onChange({ contributionAmount: parseInputNumber(e.target.value) })}
              className="text-base font-medium"
            />
          </InputGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Contribution frequency</Label>
          <Select value={inputs.frequency} onValueChange={(frequency: ContributionFrequency) => onChange({ frequency })}>
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((f) => (
                <SelectItem key={f} value={f}>
                  {FREQUENCY_LABELS[f]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="annual-increase" className="text-xs font-medium text-muted-foreground">
            Annual contribution increase <span className="opacity-70">(optional)</span>
          </Label>
          <InputGroup className="h-11 rounded-2xl px-1">
            <InputGroupInput
              id="annual-increase"
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step={1}
              placeholder="0"
              disabled={inputs.frequency === "none"}
              value={inputs.annualIncreasePct || ""}
              onChange={(e) => onChange({ annualIncreasePct: e.target.valueAsNumber || 0 })}
              className="text-base font-medium"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText className="text-foreground">%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground">Investment period</Label>
        <div className="-mx-1 flex flex-wrap gap-2 px-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ period: p })}
              className={cn(
                "rounded-full border-2 px-3.5 py-1.5 text-sm font-medium transition-colors",
                inputs.period === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-foreground hover:border-primary/50"
              )}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <Button type="button" variant="ghost" size="sm" className="w-fit gap-1.5 self-start text-muted-foreground" onClick={onRandom}>
        <Shuffle className="size-3.5" />
        Try a random comparison
      </Button>
    </div>
  );
}
