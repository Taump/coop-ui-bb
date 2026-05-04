import { useStore } from "@tanstack/react-store";

import { referrerStore } from "./store";

export function useReferrer() {
  const { address } = useStore(referrerStore, (s) => s);
  return { referrer: address };
}
