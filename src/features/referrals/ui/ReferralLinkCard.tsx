import type { FC } from "react";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import * as m from "#/paraglide/messages";

import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardTitle } from "#/shared/ui/card";
import { Input } from "#/shared/ui/input";
import { toLocalString } from "#/shared/lib/toLocalString";

interface ReferralLinkCardProps {
  address: string;
}

export const ReferralLinkCard: FC<ReferralLinkCardProps> = ({ address }) => {
  const { getParam, constants } = useCoopState();
  const { coopDecimals } = useAssetInfo(constants?.asset);
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/user/${address}`;
  const coopPct = toLocalString(
    getParam("referrer_coop_deposit_reward_share") * 100,
  );
  const bytesPct = toLocalString(
    getParam("referrer_bytes_deposit_reward_share") * 100,
  );
  const fixedReward = toLocalString(
    getParam("referral_reward") / 10 ** (coopDecimals || 9),
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (insecure context, permissions, etc.).
      // The input is selectable so the user can copy manually.
    }
  };

  return (
    <Card>
      <CardContent>
        <CardTitle>{m.referral_link_title()}</CardTitle>

        <div className="mt-3 flex gap-2">
          <Input
            type="text"
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className="font-mono text-xs"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCopy}
            aria-label={
              copied ? m.referral_link_copied() : m.referral_link_copy()
            }
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            <span className="hidden sm:inline">
              {copied ? m.referral_link_copied() : m.referral_link_copy()}
            </span>
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {m.referral_link_caption({ fixedReward, coopPct, bytesPct })}
        </p>
      </CardContent>
    </Card>
  );
};
