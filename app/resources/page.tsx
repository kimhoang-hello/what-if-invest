import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Percent, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Resources — What If Invest",
  description: "Short, plain-English guides to help beginner investors make sense of fees and asset allocation.",
};

const ARTICLES = [
  {
    href: "/resources/what-is-mer",
    title: "What Is MER?",
    description: "How a fund's yearly fee quietly eats into your returns — with a calculator to see the damage.",
    icon: Percent,
    accent: "text-etf-a",
  },
  {
    href: "/resources/asset-allocation-finder",
    title: "Asset Allocation Finder",
    description: "See what's actually inside each Canadian all-in-one ETF or mutual fund, and what it costs.",
    icon: Scale,
    accent: "text-etf-b",
  },
];

export default function ResourcesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Resources</p>
        <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">Learn the basics.</h1>
        <p className="max-w-xl text-muted-foreground">
          Short, plain-English guides to go with the comparison tool — no jargon, no sales pitch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ARTICLES.map(({ href, title, description, icon: Icon, accent }) => (
          <Link key={href} href={href}>
            <Card className="h-full rounded-3xl transition-colors hover:border-primary/40">
              <CardContent className="flex h-full flex-col gap-3 p-5 sm:p-6">
                <Icon className={`size-6 ${accent}`} />
                <div className="flex flex-col gap-1">
                  <h2 className="font-heading text-lg font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
                  Read more
                  <ArrowRight className="size-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
