import type { ReactElement } from "react";

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface WalletProtocolPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerType?: "link" | "button";
  children: ReactElement;
}

export function WalletProtocolPopover({
  open,
  onOpenChange,
  triggerType = "link",
  children,
}: WalletProtocolPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent className="max-w-[250px]">
            <p>
              This will open your Obyte wallet installed on this device to
              complete the transaction.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        side="bottom"
        className="border-white bg-white text-sm text-black shadow-lg"
      >
        <PopoverArrow className="fill-white" />
        <div>This {triggerType} opens Obyte wallet.</div>
        <div>
          Not installed? Download it from{" "}
          <a
            href="https://obyte.org/#download"
            target="_blank"
            rel="noopener"
            className="text-blue-600 underline underline-offset-4"
          >
            obyte.org
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}
