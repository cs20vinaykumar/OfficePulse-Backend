export const ENVIRONMENTS = {
  LOCAL: "LOCAL",
  DEVELOPMENT: "DEVELOPMENT",
};

export const PACKAGE_DURATIONS = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  BI_ANNUALLY: "BI_ANNUALLY",
  YEARLY: "YEARLY",
  UNLIMITED: "UNLIMITED",
};
export const PACKAGE_DAYS_VALUES_ARRAY = [
  { name: "weekly", value: PACKAGE_DURATIONS.WEEKLY, days: 7 },
  { name: "monthly", value: PACKAGE_DURATIONS.MONTHLY, days: 30 },
  { name: "quarterly", value: PACKAGE_DURATIONS.QUARTERLY, days: 90 },
  { name: "bi_annually", value: PACKAGE_DURATIONS.BI_ANNUALLY, days: 180 },
  { name: "yearly", value: PACKAGE_DURATIONS.YEARLY, days: 365 },
  { name: "unlimited", value: PACKAGE_DURATIONS.UNLIMITED, days: 100000 },
];
