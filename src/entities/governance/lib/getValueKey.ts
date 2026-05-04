// Mirrors $get_value_key from governance.oscript:
//   $key_len = length('support_messaging_attestors_' || $value);
//   ($key_len > 128) ? 'hash_'||sha256($value) : $value
// The fixed prefix length is 28; threshold for hashing is value.length > 100.

const KEY_PREFIX_LEN = "support_messaging_attestors_".length;
const MAX_KEY_LEN = 128;
export const HASH_THRESHOLD = MAX_KEY_LEN - KEY_PREFIX_LEN; // 100

export function needsHash(value: string | number): boolean {
  return String(value).length > HASH_THRESHOLD;
}

export async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getValueKey(value: string | number): Promise<string> {
  const s = String(value);
  if (!needsHash(s)) return s;
  return "hash_" + (await sha256hex(s));
}
