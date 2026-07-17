import { attestors } from "#/shared/config/appConfig";

import { rawAttestationSchema } from "../model/schemas";
import type { ParsedAttestations, RawAttestation } from "../model/schemas";

const tgSet = new Set<string>(attestors.telegramAttestors);
const discordSet = new Set<string>(attestors.discordAttestors);
const realNameSet = new Set<string>(attestors.realNameAttestors);

const EMPTY_ATTESTATIONS: ParsedAttestations = {
  telegram: null,
  discord: null,
  realName: null,
  displayName: null,
};

export function emptyAttestations(): ParsedAttestations {
  return { ...EMPTY_ATTESTATIONS };
}

export function parseRawAttestations(value: unknown): RawAttestation[] {
  if (!Array.isArray(value)) return [];
  const out: RawAttestation[] = [];
  for (const item of value) {
    const parsed = rawAttestationSchema.safeParse(item);
    if (parsed.success) {
      out.push({
        attestor_address: parsed.data.attestor_address,
        profile: parsed.data.profile,
      });
    }
  }
  return out;
}

function pickUsername(
  profile: RawAttestation["profile"] | null,
): string | null {
  if (!profile) return null;
  const username = profile.username;
  return typeof username === "string" && username.length > 0 ? username : null;
}

function hasUserId(profile: RawAttestation["profile"]): boolean {
  return profile.userId != null || profile.user_id != null;
}

function hasUsername(profile: RawAttestation["profile"]): boolean {
  return pickUsername(profile) != null;
}

// How complete an identity an attestation carries. A profile with BOTH a userId
// and a username is the most useful (avatar lookup + display name + links), so
// it must win over one that has only an id or only a username.
function completeness(profile: RawAttestation["profile"]): number {
  return (hasUserId(profile) ? 1 : 0) + (hasUsername(profile) ? 1 : 0);
}

// A user can hold several attestations from the same category (e.g. an old one
// with only a username and a newer one that also carries the userId consumers
// need for links and lookups). Keep the first match, but upgrade to a strictly
// more complete profile — an id-only or username-only slot is replaced by one
// that has both.
function merge(
  current: RawAttestation["profile"] | null,
  next: RawAttestation["profile"],
): RawAttestation["profile"] {
  if (!current) return next;
  return completeness(next) > completeness(current) ? next : current;
}

export function parseAttestations(raw: RawAttestation[]): ParsedAttestations {
  let telegram: ParsedAttestations["telegram"] = null;
  let discord: ParsedAttestations["discord"] = null;
  let realName: ParsedAttestations["realName"] = null;

  for (const att of raw) {
    if (!telegram && tgSet.has(att.attestor_address)) {
      telegram = att.profile;
    } else if (discordSet.has(att.attestor_address)) {
      discord = merge(discord, att.profile);
    } else if (realNameSet.has(att.attestor_address)) {
      realName = merge(realName, att.profile);
    } else if (tgSet.has(att.attestor_address)) {
      telegram = merge(telegram, att.profile);
    }
  }

  const displayName =
    pickUsername(telegram) ?? pickUsername(discord) ?? pickUsername(realName);

  return { telegram, discord, realName, displayName };
}
