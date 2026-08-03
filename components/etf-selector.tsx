"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ETF_LIST, getEtfMeta, type EtfMeta } from "@/lib/data/etf-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EtfSelectorProps {
  label: string;
  value: string;
  onChange: (ticker: string) => void;
  accent: "a" | "b";
  disabledTicker?: string;
  /** Which funds are selectable here — e.g. ETFs only, or ETFs + mutual funds. */
  pool?: EtfMeta[];
}

export function EtfSelector({ label, value, onChange, accent, disabledTicker, pool = ETF_LIST }: EtfSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = getEtfMeta(value);
  const dot = accent === "a" ? "bg-etf-a" : "bg-etf-b";

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto justify-between rounded-2xl border-2 px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2.5 overflow-hidden">
              <span className={cn("size-2.5 shrink-0 rounded-full", dot)} aria-hidden />
              <span className="flex flex-col overflow-hidden">
                <span className="font-heading text-base font-semibold leading-tight">
                  {selected?.ticker ?? "Select fund"}
                </span>
                <span className="truncate text-xs text-muted-foreground">{selected?.name}</span>
              </span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search ticker or name..." />
            <CommandList>
              <CommandEmpty>No fund found.</CommandEmpty>
              <CommandGroup>
                {pool.map((fund) => (
                  <CommandItem
                    key={fund.ticker}
                    value={`${fund.ticker} ${fund.name}`}
                    disabled={fund.ticker === disabledTicker}
                    onSelect={() => {
                      onChange(fund.ticker);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("opacity-0", fund.ticker === value && "opacity-100")} />
                    <span className="font-medium">{fund.ticker}</span>
                    <span className="truncate text-muted-foreground">{fund.name}</span>
                    {fund.assetType === "mutual-fund" && (
                      <Badge variant="outline" className="shrink-0 text-[0.65rem] text-muted-foreground">
                        Mutual Fund
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
