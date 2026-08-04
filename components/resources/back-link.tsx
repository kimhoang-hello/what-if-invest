import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href = "/resources", label = "Resources" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft className="size-3.5" />
      {label}
    </Link>
  );
}
