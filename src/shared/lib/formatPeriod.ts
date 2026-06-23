import { getLocale } from "#/shared/i18n";

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

/**
 * Formats a count of time units localized to the current locale, e.g.
 * `3 days` / `3 дн.`, `4h` / `4 ч`, `5 minutes` / `5 минут`. `Intl` handles
 * pluralization per locale (incl. Russian/Ukrainian three-form plurals).
 */
function unit(
  value: number,
  u: "day" | "hour" | "minute",
  display: "long" | "narrow",
): string {
  return new Intl.NumberFormat(getLocale(), {
    style: "unit",
    unit: u,
    unitDisplay: display,
  }).format(value);
}

/**
 * Formats the remaining time until a UTC unix-timestamp (seconds)
 * into a human-readable, locale-aware string like "3 days 4h 12m".
 *
 * Arithmetic is over UTC timestamps (no timezone dependency); only the unit
 * labels are localized via the current locale (`getLocale()`).
 *
 * With `collapseDays`, anything a day or more away is shown as whole days only
 * ("3 days"); below a day it falls back to hours and minutes ("4h 12m").
 */
export const formatPeriod = (
  periodEndTs: number,
  { collapseDays = false }: { collapseDays?: boolean } = {},
): string => {
  // Both values are UTC: unix timestamp (seconds) and Date.now() (ms → seconds)
  const remainingSec = periodEndTs - Math.floor(Date.now() / 1000);

  if (remainingSec <= 0) return unit(0, "minute", "long");

  const days = Math.floor(remainingSec / DAY);
  const hours = Math.floor((remainingSec % DAY) / HOUR);
  const minutes = Math.floor((remainingSec % HOUR) / MINUTE);

  if (collapseDays && days >= 1) return unit(days, "day", "long");

  const parts: string[] = [];
  if (days) parts.push(unit(days, "day", "long"));
  if (hours) parts.push(unit(hours, "hour", "narrow"));
  if (minutes || !parts.length) {
    parts.push(
      parts.length
        ? unit(minutes, "minute", "narrow")
        : unit(minutes, "minute", "long"),
    );
  }

  return parts.join(" ");
};
