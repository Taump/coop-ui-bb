import { Store } from "@tanstack/store";
import { storageKey } from "#/shared/lib/storageKey";

const STORAGE_KEY = storageKey("referrer_address");

interface ReferrerState {
  address: string | null;
}

function loadFromStorage(): ReferrerState {
  try {
    const address = localStorage.getItem(STORAGE_KEY);
    return { address };
  } catch {
    return { address: null };
  }
}

function saveToStorage(state: ReferrerState) {
  try {
    if (state.address) {
      localStorage.setItem(STORAGE_KEY, state.address);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export const referrerStore = new Store<ReferrerState>(loadFromStorage());

referrerStore.subscribe(() => {
  saveToStorage(referrerStore.state);
});

export const setReferrer = (address: string) => {
  referrerStore.setState(() => ({ address }));
};

export const clearReferrer = () => {
  referrerStore.setState(() => ({ address: null }));
};
