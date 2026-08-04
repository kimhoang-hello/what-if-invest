import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BackLink } from "@/components/resources/back-link";
import { FeeImpactCalculator } from "@/components/resources/fee-impact-calculator";

export const metadata: Metadata = {
  title: "What Is MER? — What If Invest",
  description: "How a fund's Management Expense Ratio quietly eats into your investment returns over time.",
};

export default function WhatIsMerPage() {
  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Resources</p>
        <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">What is MER?</h1>
        <p className="max-w-xl text-muted-foreground">
          MER stands for Management Expense Ratio — the yearly fee a fund charges you to manage your money, taken
          automatically out of the fund&apos;s returns before you ever see them.
        </p>
      </div>

      <article className="flex flex-col gap-6 text-[15px] leading-relaxed text-foreground/90">
        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">How it actually gets charged</h2>
          <p>
            You&apos;ll never see a bill for it. A fund&apos;s daily price already has the fee built in — a fund
            with a 1% MER is quietly shaving off roughly 1/365th of that percentage from its value every single day.
            It never shows up as a line item on your statement, which is exactly why it&apos;s so easy to ignore.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">Typical MER ranges</h2>
          <ul className="flex flex-col gap-1.5">
            <li>
              <span className="font-medium text-foreground">Index ETFs</span> (like the ones in this app&apos;s
              comparison tool) tend to run low — often well under 0.3% a year.
            </li>
            <li>
              <span className="font-medium text-foreground">Actively managed mutual funds</span> — the kind sold at
              many banks — commonly charge noticeably more, since you&apos;re also paying for a manager, research,
              and advisor commissions built into the fund.
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Exact fees vary by fund and change over time — always check a fund&apos;s current fact sheet or
            prospectus for its actual MER before investing.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Why a &quot;small&quot; percentage matters so much
            </h2>
            <p className="mt-2">
              1% doesn&apos;t sound like much. But fees compound the same way gains do — except in reverse, every
              single year, for as long as you hold the fund. Try it yourself:
            </p>
          </div>
          <FeeImpactCalculator />
        </section>

        <section className="flex flex-col gap-2 rounded-3xl bg-secondary p-5">
          <h2 className="font-heading text-lg font-semibold text-foreground">Why this matters for the tool above</h2>
          <p>
            This is a big part of why an ETF often beats a comparable mutual fund in the comparisons you run here —
            even when they hold similar things, the ETF is usually taking a smaller bite every year, and that
            difference compounds right alongside your gains.
          </p>
          <Link href="/" className="flex w-fit items-center gap-1 font-medium text-primary hover:underline">
            Try comparing an ETF against a mutual fund
            <ArrowRight className="size-3.5" />
          </Link>
        </section>
      </article>
    </div>
  );
}
