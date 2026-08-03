import { Suspense } from "react";
import { ComparisonApp } from "@/components/comparison-app";
import { ResultsSkeleton } from "@/components/loading-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <ComparisonApp />
    </Suspense>
  );
}
