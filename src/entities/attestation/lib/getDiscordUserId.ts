import type { ParsedAttestations } from "../model/schemas";
import { getProfileField } from "./getProfileField";

const SNOWFLAKE_RE = /^\d{1,20}$/;

/**
 * Discord user id from attestations; handles both the `userId` and legacy
 * `user_id` profile keys. Returns `null` unless the value is a valid Discord
 * snowflake — consumers build URLs and API requests from it, so anything else
 * would only produce a guaranteed-invalid (and potentially unsafe) request.
 */
export function getDiscordUserId(
  attestations: ParsedAttestations | null | undefined,
): string | null {
  const profile = attestations?.discord;
  const id =
    getProfileField(profile, "userId") ?? getProfileField(profile, "user_id");
  return id && SNOWFLAKE_RE.test(id) ? id : null;
}
