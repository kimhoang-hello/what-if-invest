import Link from "next/link";
import { Percent, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-etf-a to-etf-b text-white">
          <TrendingUp className="size-4" />
        </span>
        <span className="font-heading text-lg font-semibold">What If Invest</span>
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary" size="sm" className="gap-1.5 rounded-full font-medium">
          <Link href="/resources/what-is-mer">
            <Percent className="size-3.5" />
            What Is MER?
          </Link>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
