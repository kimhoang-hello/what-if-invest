"use client";

import Link from "next/link";
import { ChevronDown, Percent, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RESOURCE_LINKS = [
  {
    href: "/resources/what-is-mer",
    label: "What Is MER?",
    description: "How fund fees quietly eat your returns",
    icon: Percent,
  },
  {
    href: "/resources/asset-allocation-finder",
    label: "Asset Allocation Finder",
    description: "See what's inside a fund, and what it costs",
    icon: Scale,
  },
];

export function ResourcesMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
          Resources
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-2xl p-2">
        {RESOURCE_LINKS.map(({ href, label, description, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild className="cursor-pointer gap-3 rounded-xl p-3">
            <Link href={href}>
              <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium leading-none text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
