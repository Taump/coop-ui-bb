import type { ReactNode } from "react";

import { cn } from "#/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface DisabledTooltipProps {
  /** Why the wrapped control is disabled, or null when it is enabled. */
  reason: string | null;
  /** Wrapper element — use "div" when the child is not phrasing content. */
  as?: "span" | "div";
  className?: string;
  children: ReactNode;
}

/**
 * Explains a disabled control. The wrapper is always rendered so layout does
 * not shift when the control becomes enabled; only the tooltip is conditional.
 */
export function DisabledTooltip({
  reason,
  as: Wrapper = "span",
  className,
  children,
}: DisabledTooltipProps) {
  if (!reason) return <Wrapper className={className}>{children}</Wrapper>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/*
          The wrapper is the trigger, not the control: `pointer-events-none`
          hands hover and taps up to it instead of letting the control swallow
          them, and `tabIndex` puts the reason back in the tab order that a
          `disabled` control drops out of.
        */}
        <Wrapper
          tabIndex={0}
          className={cn(
            "rounded-md [&>*]:pointer-events-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            className,
          )}
        >
          {children}
        </Wrapper>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );
}
