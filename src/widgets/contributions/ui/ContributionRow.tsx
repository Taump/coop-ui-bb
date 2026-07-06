import type { FC } from "react";

import { getDiscordThreadUrl } from "#/entities/contribution";
import type { ContributionPost } from "#/entities/contribution";
import { formatDateShort } from "#/shared/lib/formatDateShort";

import { ReactionChips } from "./ReactionChips";

export const ContributionRow: FC<{ post: ContributionPost }> = ({ post }) => {
  const threadUrl = getDiscordThreadUrl(post.guildId, post.postId);
  const title = threadUrl ? (
    <a
      href={threadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="truncate font-medium hover:underline"
    >
      {post.title}
    </a>
  ) : (
    <span className="truncate font-medium">{post.title}</span>
  );

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        {title}
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDateShort(new Date(post.lastActivityAt))}
        </span>
      </div>
      {post.description && (
        <p className="mt-0.5 line-clamp-2 break-words text-muted-foreground">
          {post.description}
        </p>
      )}
      <ReactionChips reactions={post.reactions} />
    </div>
  );
};
