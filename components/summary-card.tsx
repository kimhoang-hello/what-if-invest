import { Sparkles } from "lucide-react";

interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-3xl bg-secondary p-6">
      <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
      <p className="font-heading text-xl leading-snug italic sm:text-2xl">{summary}</p>
    </div>
  );
}
