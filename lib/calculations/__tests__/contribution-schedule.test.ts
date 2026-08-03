import { describe, it, expect } from "vitest";
import { generateContributionSchedule } from "@/lib/calculations/contribution-schedule";

describe("generateContributionSchedule", () => {
  it("returns no dates for lump-sum-only (none)", () => {
    expect(generateContributionSchedule("2020-01-01", "2025-01-01", "none")).toEqual([]);
  });

  it("generates one date per month for monthly", () => {
    const dates = generateContributionSchedule("2024-01-15", "2024-04-15", "monthly");
    expect(dates).toEqual(["2024-02-15", "2024-03-15", "2024-04-15"]);
  });

  it("does not permanently drift the day-of-month after a short-month clamp", () => {
    // Jan 31 -> Feb clamps to 29 (2020 is a leap year), but March/April/May/June
    // should return to day 31/30 rather than staying stuck at 29.
    const dates = generateContributionSchedule("2020-01-31", "2020-06-30", "monthly");
    expect(dates).toEqual(["2020-02-29", "2020-03-31", "2020-04-30", "2020-05-31", "2020-06-30"]);
  });

  it("generates weekly dates 7 days apart", () => {
    const dates = generateContributionSchedule("2024-01-01", "2024-01-29", "weekly");
    expect(dates).toEqual(["2024-01-08", "2024-01-15", "2024-01-22", "2024-01-29"]);
  });

  it("excludes the start date itself", () => {
    const dates = generateContributionSchedule("2024-01-01", "2024-01-01", "monthly");
    expect(dates).toEqual([]);
  });
});
