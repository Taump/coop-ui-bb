import { useEffect } from "react";

import { useCoopState } from "#/entities/coop";
import { setReferrer } from "#/entities/referrer";
import { useWallet } from "#/entities/user";
import { getReferrerFromUrl } from "#/shared/lib/getReferrerFromUrl";

/**
 * Picks up a referrer candidate from the URL (path or `?ref=` query) when the
 * coop state is loaded. Saves it to the persistent store only if the candidate
 * exists in the AA state vars and is not the currently connected wallet.
 */
export function useTrackReferrer() {
  const { status, getUser } = useCoopState();
  const { address: connectedAddress } = useWallet();

  useEffect(() => {
    if (status !== "loaded") return;
    const candidate = getReferrerFromUrl();
    if (!candidate) return;
    if (candidate === connectedAddress) return;
    if (!getUser(candidate)) return;
    setReferrer(candidate);
  }, [status, getUser, connectedAddress]);
}
