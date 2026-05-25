import type { ReactNode } from "react";
import { cn } from "#/shared/lib/utils";

export function LiquidGlass({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border/50 bg-background/75 relative border backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
