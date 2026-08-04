import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ResourcesMenu } from "@/components/resources-menu";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-etf-a to-etf-b text-white">
          <TrendingUp className="size-4" />
        </span>
        <span className="font-heading text-lg font-semibold">What If Invest</span>
      </Link>
      <div className="flex items-center gap-1">
        <ResourcesMenu />
        <ThemeToggle />
      </div>
    </header>
  );
}
