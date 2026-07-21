import { useEffect, useState } from "react";

// setTimeout truncates delays above the signed 32-bit limit, so long waits are
// re-armed in chunks instead of firing immediately.
const MAX_DELAY = 2_147_483_647;

/**
 * Whether a unix timestamp (seconds) has passed, re-rendering the moment it
 * does. A `Date.now()` comparison made during render goes stale, so UI gated on
 * a deadline stays hidden until some unrelated update forces a re-render.
 */
export function useExpired(endTs: number | undefined): boolean {
  const [expired, setExpired] = useState(
    () => endTs !== undefined && Date.now() >= endTs * 1000,
  );

  useEffect(() => {
    if (endTs === undefined) {
      setExpired(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const check = () => {
      const msLeft = endTs * 1000 - Date.now();
      if (msLeft <= 0) {
        setExpired(true);
        return;
      }
      setExpired(false);
      // Re-checked on every wake-up, so a suspended tab that overshoots the
      // deadline settles on the next tick rather than waiting a full round.
      timer = setTimeout(check, Math.min(msLeft, MAX_DELAY));
    };

    check();

    return () => clearTimeout(timer);
  }, [endTs]);

  return expired;
}
