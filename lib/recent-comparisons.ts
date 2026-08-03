import type { ComparisonInputs } from "@/lib/comparison-state";

const STORAGE_KEY = "what-if-invest:recent-comparisons";
const MAX_ENTRIES = 5;
const EMPTY: RecentComparison[] = [];

export interface RecentComparison extends ComparisonInputs {
  savedAt: string;
}

function readFromStorage(): RecentComparison[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

// Cached snapshot + pub-sub so this can back a useSyncExternalStore hook
// (getSnapshot must return a stable reference when nothing has changed).
let cache: RecentComparison[] = readFromStorage();
const listeners = new Set<() => void>();

function setCache(next: RecentComparison[]) {
  cache = next;
  listeners.forEach((listener) => listener());
}

export function subscribeRecentComparisons(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRecentComparisonsSnapshot(): RecentComparison[] {
  return cache;
}

export function getRecentComparisonsServerSnapshot(): RecentComparison[] {
  return EMPTY;
}

export function saveRecentComparison(inputs: ComparisonInputs): void {
  if (typeof window === "undefined") return;

  const existing = cache.filter((entry) => !(entry.etfA === inputs.etfA && entry.etfB === inputs.etfB));
  const next: RecentComparison[] = [{ ...inputs, savedAt: new Date().toISOString() }, ...existing].slice(0, MAX_ENTRIES);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  setCache(next);
}

export function clearRecentComparisons(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  setCache(EMPTY);
}
