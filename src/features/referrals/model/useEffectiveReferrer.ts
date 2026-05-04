import { useMemo } from "react";

import { useCoopState } from "#/entities/coop";
import { useReferrer } from "#/entities/referrer";
import { useWallet } from "#/entities/user";

import { resolveEffectiveReferrer } from "../lib/resolveEffectiveReferrer";

export function useEffectiveReferrer(): string | undefined {
  const { address } = useWallet();
  const { getUser } = useCoopState();
  const { referrer: stored } = useReferrer();

  return useMemo(
    () => resolveEffectiveReferrer(stored, address, getUser),
    [stored, address, getUser],
  );
}
