import type { CoopUser } from "../model/types";

interface CoopAaState {
  total_locked: number;
  total_locked_bytes: number;
  liquid_emissions: number;
  total_votes: number;
  total_votes_bal: number;
  ts: number;
}

interface EmissionParams {
  daily_liquid_reward: number;
  bytes_reducer: number;
  by_votes_share: number;
}

/**
 * Mirrors AA's $update_emissions + $update_user for liquid_balance.
 * Returns the live claimable amount (in atomic units), accounting for emissions
 * accrued since the user's last interaction.
 */
export function computeLiveLiquidBalance(
  user: CoopUser,
  state: CoopAaState,
  params: EmissionParams,
  ceilingPrice: number,
  nowSec: number = Math.floor(Date.now() / 1000),
): number {
  const stored = user.liquid_balance ?? 0;
  if (!state.total_votes || !state.total_votes_bal) return stored;
  if (!user.votes || user.votes <= 0) return stored;

  const elapsedDays = Math.max(0, (nowSec - state.ts) / 86400);
  const s =
    state.total_locked +
    (state.total_locked_bytes / ceilingPrice) * params.bytes_reducer;

  const liveLiquidEmissions =
    state.liquid_emissions + s * params.daily_liquid_reward * elapsedDays;

  const newLiquidEmissions = liveLiquidEmissions - user.last_liquid_emissions;

  const userShare =
    params.by_votes_share * (user.votes / state.total_votes) +
    (1 - params.by_votes_share) *
      ((user.votes * user.total_balance) / state.total_votes_bal);

  return stored + newLiquidEmissions * userShare;
}
