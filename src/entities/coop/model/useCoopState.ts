import { useCallback } from "react";
import { useStore } from "@tanstack/react-store";
import { z } from "zod";

import { defaultParams } from "#/shared/config/appConfig";
import type { AppParamName, AppParams } from "#/shared/config/appConfig";
import { getCeilingPrice as calcCeilingPrice } from "../lib/getCeilingPrice";
import { coopConstantsSchema, parseCoopUser } from "./schemas";

import { coopStore } from "./store";
import type { CoopUser } from "./types";

const variablesSchema = z
  .object({
    daily_locked_reward: z.number().optional(),
    daily_liquid_reward: z.number().optional(),
    bytes_reducer: z.number().optional(),
    by_votes_share: z.number().optional(),
    messaging_attestors: z.string().optional(),
    real_name_attestors: z.string().optional(),
    referrer_coop_deposit_reward_share: z.number().optional(),
    referrer_bytes_deposit_reward_share: z.number().optional(),
    referral_reward: z.number().optional(),
    min_balance_instead_of_real_name: z.number().optional(),
  })
  .partial();

export function useCoopState() {
  const { status, vars } = useStore(coopStore, (s) => s);

  const constantsResult = coopConstantsSchema.safeParse(vars.constants);
  const constants = constantsResult.success ? constantsResult.data : undefined;

  const variablesResult = variablesSchema.safeParse(vars.variables ?? {});
  const variables = variablesResult.success
    ? (variablesResult.data as Partial<AppParams>)
    : undefined;

  const getParam = useCallback(
    <TKey extends AppParamName>(name: TKey): AppParams[TKey] => {
      if (variables && variables[name] !== undefined) return variables[name];
      return defaultParams[name];
    },
    [variables],
  );

  const getCeilingPrice = useCallback((): number | undefined => {
    if (!constants?.launch_ts) return undefined;
    return calcCeilingPrice(constants.launch_ts);
  }, [constants?.launch_ts]);

  const getUser = useCallback(
    (address: string): CoopUser | undefined => {
      return parseCoopUser(vars[`user_${address}`]);
    },
    [vars],
  );

  return { status, vars, constants, getParam, getCeilingPrice, getUser };
}
