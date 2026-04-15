import type { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { toLocalString } from "#/shared/lib/toLocalString";

import { useVotesReceived } from "#/entities/coop";

import { UserDisplayName } from "./UserDisplayName";

import * as m from "#/paraglide/messages";

interface VotesListProps {
  address: string;
}

export const VotesList: FC<VotesListProps> = ({ address }) => {
  const voteRecords = useVotesReceived(address);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.profile_votes_list_title()}</CardTitle>
      </CardHeader>
      <CardContent>
        {voteRecords.length > 0 ? (
          <div className="grid gap-2">
            {voteRecords.map((record) => (
              <div
                key={record.fromAddress}
                className="flex items-center justify-between text-sm"
              >
                <UserDisplayName address={record.fromAddress} />
                <span className="text-muted-foreground">
                  {toLocalString(record.votes)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground">
            {m.profile_votes_empty()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
