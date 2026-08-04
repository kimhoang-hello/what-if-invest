"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

const DEFAULTS = {
  amount: 10000,
  years: 25,
  grossReturnPct: 7,
  merLowPct: 0.1,
  merHighPct: 2,
};

function futureValue(amount: number, years: number, grossReturnPct: number, merPct: number): number {
  const netReturn = (grossReturnPct - merPct) / 100;
  return amount * Math.pow(1 + netReturn, years);
}

export function FeeImpactCalculator() {
  const [amount, setAmount] = useState(DEFAULTS.amount);
  const [years, setYears] = useState(DEFAULTS.years);
  const [grossReturnPct, setGrossReturnPct] = useState(DEFAULTS.grossReturnPct);
  const [merHighPct, setMerHighPct] = useState(DEFAULTS.merHighPct);
  const merLowPct = DEFAULTS.merLowPct;

  const lowValue = futureValue(amount, years, grossReturnPct, merLowPct);
  const highValue = futureValue(amount, years, grossReturnPct, merHighPct);
  const diff = lowValue - highValue;

  return (
    <Card className="rounded-3xl">
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Amount invested">
            <InputGroup className="h-10 rounded-xl px-1">
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                min={0}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
              />
            </InputGroup>
          </Field>
          <Field label="Years held">
            <InputGroup className="h-10 rounded-xl px-1">
              <InputGroupInput
                type="number"
                min={1}
                max={60}
                step={1}
                value={years}
                onChange={(e) => setYears(e.target.valueAsNumber || 0)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>yrs</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field label="Expected return">
            <InputGroup className="h-10 rounded-xl px-1">
              <InputGroupInput
                type="number"
                min={0}
                max={30}
                step={0.5}
                value={grossReturnPct}
                onChange={(e) => setGrossReturnPct(e.target.valueAsNumber || 0)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field label="Fund B's MER">
            <InputGroup className="h-10 rounded-xl px-1">
              <InputGroupInput
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={merHighPct}
                onChange={(e) => setMerHighPct(e.target.valueAsNumber || 0)}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Fund A — {merLowPct.toFixed(2)}% MER</p>
            <p className="font-heading text-2xl font-semibold tabular-nums">{formatCurrency(lowValue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fund B — {merHighPct.toFixed(2)}% MER</p>
            <p className="font-heading text-2xl font-semibold tabular-nums">{formatCurrency(highValue)}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-secondary p-4 text-sm">
          Same amount, same return, same {years} years — just a different fee. The lower-fee fund ends up{" "}
          <span className="font-semibold text-winner">{formatCurrency(diff)} ahead</span>, purely from MER.
        </div>

        <p className="text-xs text-muted-foreground">
          Fund A&apos;s MER is fixed at {merLowPct.toFixed(2)}%, a typical index ETF fee — adjust Fund B&apos;s to see
          how a higher-cost mutual fund compares. This assumes a lump sum with no further contributions, to keep the
          fee effect easy to isolate.
        </p>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
