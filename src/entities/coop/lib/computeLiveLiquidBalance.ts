import type { CoopUser } from "../model/types";

interface CoopAaState {
  total_locked: number;
  total_locked_bytes: number;
  liquid_emissions: number;
  liquid_emissions_per_vote: number;
  liquid_emissions_per_vb: number;
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
  if (!user.votes || user.votes <= 0) return stored;

  const elapsedDays = Math.max(0, (nowSec - state.ts) / 86400);
  const s =
    state.total_locked +
    (state.total_locked_bytes / ceilingPrice) * params.bytes_reducer;

  const newLiquidEmissions = s * params.daily_liquid_reward * elapsedDays;

  let liveLiqPerVote = state.liquid_emissions_per_vote;
  let liveLiqPerVb = state.liquid_emissions_per_vb;
  if (state.total_votes > 0 && state.total_votes_bal > 0) {
    liveLiqPerVote += newLiquidEmissions / state.total_votes;
    liveLiqPerVb += newLiquidEmissions / state.total_votes_bal;
  }

  const dPerVote = liveLiqPerVote - user.last_liquid_emissions_per_vote;
  const dPerVb = liveLiqPerVb - user.last_liquid_emissions_per_vb;

  const v = params.by_votes_share * user.votes;
  const vb = (1 - params.by_votes_share) * user.votes * user.total_balance;

  return stored + v * dPerVote + vb * dPerVb;
}
