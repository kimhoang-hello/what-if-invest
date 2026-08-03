import type { ContributionFrequency } from "@/lib/calculations/types";
import { addDays, addMonthsClamped } from "@/lib/calculations/date-utils";

const DAY_STEP: Partial<Record<ContributionFrequency, number>> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
};

const MONTH_STEP: Partial<Record<ContributionFrequency, number>> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

/**
 * Generates recurring contribution dates strictly after startDate, up to and
 * including endDate. The initial lump sum on startDate is handled separately
 * by the caller. "none" (lump sum only) yields an empty schedule.
 *
 * Each date is computed from the original startDate anchor (not chained from
 * the previous date) so a start-of-month clamp (e.g. Jan 31 -> Feb 29) can't
 * permanently drift the day-of-month for later, longer months.
 */
export function generateContributionSchedule(
  startDate: string,
  endDate: string,
  frequency: ContributionFrequency
): string[] {
  if (frequency === "none") return [];

  const dayStep = DAY_STEP[frequency];
  const monthStep = MONTH_STEP[frequency];
  const dates: string[] = [];

  for (let k = 1; ; k++) {
    const candidate = dayStep ? addDays(startDate, dayStep * k) : addMonthsClamped(startDate, monthStep! * k);
    if (candidate > endDate) break;
    dates.push(candidate);
  }

  return dates;
}
