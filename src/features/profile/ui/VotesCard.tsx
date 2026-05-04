import type { FC } from "react";

import { Card, CardContent, CardTitle } from "#/shared/ui/card";
import { toLocalString } from "#/shared/lib/toLocalString";
import { getVotesDivisor } from "#/shared/lib/votesScale";

import * as m from "#/paraglide/messages";

interface VotesCardProps {
  totalVotes: number;
  coopDecimals: number;
}

export const VotesCard: FC<VotesCardProps> = ({ totalVotes, coopDecimals }) => {
  const votesDivisor = getVotesDivisor(coopDecimals);
  return (
    <Card>
      <CardContent>
        <CardTitle>{m.profile_votes_title()}</CardTitle>
        <div className="mt-2 text-lg lg:text-xl">
          {toLocalString(totalVotes / votesDivisor)}
        </div>
      </CardContent>
    </Card>
  );
};
