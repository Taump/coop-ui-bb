import type { FC } from "react";

import type { ReactionCount } from "#/entities/contribution";

import * as m from "#/paraglide/messages";

// The server sends reactions busiest-first; cap the row so a heavily-reacted
// post can't blow up the card.
const MAX_CHIPS = 5;

export const ReactionChips: FC<{ reactions: ReactionCount[] }> = ({
  reactions,
}) => {
  if (reactions.length === 0) return null;

  const visible = reactions.slice(0, MAX_CHIPS);
  const hidden = reactions.length - visible.length;

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
      {visible.map((reaction) => (
        <span
          key={reaction.emoji}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs"
        >
          <span>{reaction.emoji}</span>
          <span className="tabular-nums text-muted-foreground">
            {reaction.count}
          </span>
        </span>
      ))}
      {hidden > 0 && (
        <span className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs text-muted-foreground">
          {m.contributions_more_reactions({ count: hidden })}
        </span>
      )}
    </div>
  );
};
