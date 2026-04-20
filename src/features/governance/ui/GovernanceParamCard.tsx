import { useState } from "react";
import { Info } from "lucide-react";
import * as m from "#/paraglide/messages";

import { formatParamName } from "#/shared/lib/formatParamName";
import { getParamDescription } from "#/shared/lib/getParamDescription";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "#/shared/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";
import { QRButton } from "#/shared/ui/qr-button";

import { toLocalString } from "#/shared/lib/toLocalString";
import type { ParsedGovernanceParam } from "#/entities/governance";

import { formatParamValue } from "../lib/formatParamValue";
import { buildCommitLink } from "../lib/buildGovernanceLink";
import { Countdown } from "./Countdown";
import { GovernanceVoteDialog } from "./GovernanceVoteDialog";

interface GovernanceParamCardProps {
  param: ParsedGovernanceParam;
  governanceAa: string;
  address: string | null;
  coopDecimals: number;
  coopSymbol: string;
}

export function GovernanceParamCard({
  param,
  governanceAa,
  address,
  coopDecimals,
  coopSymbol,
}: GovernanceParamCardProps) {
  const {
    def,
    currentValue,
    leader,
    challengingPeriodEndTs,
    supports,
    userChoice,
  } = param;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitialValue, setDialogInitialValue] = useState<
    string | number | undefined
  >(undefined);

  const openDialog = (initialValue?: string | number) => {
    setDialogInitialValue(initialValue);
    setDialogOpen(true);
  };

  const formattedCurrent = formatParamValue(
    currentValue,
    def,
    coopDecimals,
    coopSymbol,
  );

  const hasLeader =
    leader !== undefined && String(leader) !== String(currentValue);
  const leaderValue = hasLeader ? leader : currentValue;

  const now = Math.floor(Date.now() / 1000);
  const challengeExpired =
    challengingPeriodEndTs !== undefined && now >= challengingPeriodEndTs;

  const commitHref =
    hasLeader && challengeExpired && address
      ? buildCommitLink({
          governanceAa,
          name: def.name,
          fromAddress: address,
        })
      : null;

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <CardTitle className="text-xl">
                {formatParamName(def.name)}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{getParamDescription(def.name)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm">
              <span className="text-muted-foreground">
                {m.governance_param_current_value()}{" "}
              </span>
              <span className="font-medium">{formattedCurrent}</span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 pb-3">
          {userChoice !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {m.governance_param_your_vote()}
              </span>
              <span className="font-medium">
                {formatParamValue(userChoice, def, coopDecimals, coopSymbol)}
              </span>
            </div>
          )}

          {hasLeader && (
            <div className="rounded-md bg-muted/50 p-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {m.governance_param_leader()}
                </span>
                <span className="font-medium">
                  {formatParamValue(leaderValue, def, coopDecimals, coopSymbol)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                {challengeExpired ? (
                  <>
                    <span className="text-xs text-muted-foreground">
                      {m.governance_param_ready_to_commit()}
                    </span>
                    <QRButton
                      href={commitHref ?? ""}
                      disabled={!commitHref}
                      size="xs"
                      variant="link"
                    >
                      {m.governance_param_commit()}
                    </QRButton>
                  </>
                ) : (
                  challengingPeriodEndTs && (
                    <>
                      <span className="text-xs text-muted-foreground">
                        {m.governance_param_challenge_ends_in()}
                      </span>
                      <span className="text-xs font-medium">
                        <Countdown endTs={challengingPeriodEndTs} />
                      </span>
                    </>
                  )
                )}
              </div>
            </div>
          )}

          {supports.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="border-b border-border px-3 py-2 text-left font-medium">
                      {m.governance_param_col_value()}
                    </th>
                    <th className="border-b border-border px-3 py-2 text-right font-medium">
                      {m.governance_param_col_support()}
                    </th>
                    <th className="border-b border-border px-3 py-2 text-right font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {supports.map((s, i) => (
                    <tr
                      key={s.valueKey}
                      className={i > 0 ? "border-t border-border" : ""}
                    >
                      <td className="max-w-[40%] truncate px-3 py-2 font-mono text-xs">
                        {formatParamValue(
                          s.valueKey,
                          def,
                          coopDecimals,
                          coopSymbol,
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                        {toLocalString(s.support)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => openDialog(s.valueKey)}
                          disabled={!address}
                          className="cursor-pointer text-xs text-foreground underline underline-offset-4 hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50"
                        >
                          {m.governance_param_vote_for_value()}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <button
            onClick={() => openDialog()}
            disabled={!address}
            className="cursor-pointer text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            {m.governance_param_suggest_value()}
          </button>
        </CardFooter>
      </Card>

      <GovernanceVoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValue={dialogInitialValue}
        param={param}
        governanceAa={governanceAa}
        address={address}
        coopDecimals={coopDecimals}
        coopSymbol={coopSymbol}
      />
    </>
  );
}
