import type { FC, ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Card, CardContent, CardTitle } from "#/shared/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#/shared/ui/collapsible";
import { Separator } from "#/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { toLocalString } from "#/shared/lib/toLocalString";
import { formatRounded } from "#/shared/lib/formatRounded";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import { cn } from "#/shared/lib/utils";

import type { CoopUser } from "#/entities/coop";

import * as m from "#/paraglide/messages";

interface BalanceCardProps {
  user: CoopUser;
  coopDecimals: number;
  gbyteDecimals: number;
  coopSymbol: string;
  gbyteSymbol: string;
  /**
   * Optional slot rendered next to the unlock-date row. The page composes the
   * actual deposit-dialog trigger here, so this card stays free of any
   * cross-feature imports.
   */
  action?: ReactNode;
}

interface AmountProps {
  value: number;
  decimals: number;
  symbol: string;
}

const Amount: FC<AmountProps> = ({ value, decimals, symbol }) => {
  const rounded = formatRounded(value, decimals);
  const exact = toLocalString(value);

  if (rounded === exact) {
    return <span>{rounded}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{rounded}</span>
        </TooltipTrigger>
        <TooltipContent>
          {exact} {symbol}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const BalanceCard: FC<BalanceCardProps> = ({
  user,
  coopDecimals,
  gbyteDecimals,
  coopSymbol,
  gbyteSymbol,
  action,
}) => {
  const [collapsed, setCollapsed] = useState(true);

  const coopDivisor = 10 ** coopDecimals;
  const gbyteDivisor = 10 ** gbyteDecimals;

  const totalBalanceRaw = user.total_balance / coopDivisor;
  const coopBalanceRaw = user.balance / coopDivisor;
  const gbyteBalanceRaw = user.bytes_balance / gbyteDivisor;
  const liquidBalanceRaw = (user.liquid_balance ?? 0) / coopDivisor;
  const hasDetails = user.balance > 0 || user.bytes_balance > 0;

  return (
    <Card>
      <CardContent>
        <CardTitle>{m.profile_balance_title()}</CardTitle>
        <Collapsible
          open={hasDetails && !collapsed}
          onOpenChange={() => hasDetails && setCollapsed(!collapsed)}
        >
          <CollapsibleTrigger asChild className="mt-2 text-lg lg:text-xl">
            <div className={cn(hasDetails ? "cursor-pointer select-none" : "")}>
              <Amount
                value={totalBalanceRaw}
                decimals={coopDecimals}
                symbol={coopSymbol}
              />{" "}
              <small>{coopSymbol}</small>
              {hasDetails && (
                <ChevronDown
                  className={cn(
                    "ml-2 inline-block transition-transform duration-200",
                    collapsed ? "rotate-0" : "-rotate-180",
                  )}
                  size={24}
                />
              )}
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 grid gap-3 text-sm">
            <Separator />

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {m.profile_coop_balance()}
              </span>
              <span>
                <Amount
                  value={coopBalanceRaw}
                  decimals={coopDecimals}
                  symbol={coopSymbol}
                />{" "}
                {coopSymbol}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {m.profile_gbyte_balance()}
              </span>
              <span>
                <Amount
                  value={gbyteBalanceRaw}
                  decimals={gbyteDecimals}
                  symbol={gbyteSymbol}
                />{" "}
                {gbyteSymbol}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {m.profile_liquid_balance()}
              </span>
              <span>
                <Amount
                  value={liquidBalanceRaw}
                  decimals={coopDecimals}
                  symbol={coopSymbol}
                />{" "}
                {coopSymbol}
              </span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-3 flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">
            {m.profile_unlock_date()}:{" "}
            <span className="text-foreground">
              {user.total_balance === 0
                ? m.profile_not_locked_yet()
                : user.unlock_date
                  ? formatDateShort(new Date(user.unlock_date))
                  : m.profile_unlocked()}
            </span>
          </span>
          {action}
        </div>
      </CardContent>
    </Card>
  );
};
