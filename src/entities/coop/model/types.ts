export interface CoopConstants {
  asset: string;
  launch_ts: number;
  governance_aa: string;
}

export interface CoopUser {
  balance: number;
  bytes_balance: number;
  total_balance: number;
  unlock_date: string | false;
  reg_date: string;
  reg_ts: number;
  last_ts: number;
  last_locked_emissions: number;
  last_liquid_emissions: number;
  liquid_balance?: number;
  votes?: number;
  ref?: string;
  no_referrer_deposit_reward?: boolean;
  referral_rewards?: number;
  referred_users?: number;
}
