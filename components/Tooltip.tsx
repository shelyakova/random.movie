"use client";

import { useState, ReactNode } from "react";
import { TooltipAlign, TooltipPlacement } from "@/lib/types/enums";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  placement?: TooltipPlacement;
  align?: TooltipAlign;
}

export default function Tooltip({
  content,
  children,
  className = "",
  placement = TooltipPlacement.Top,
  align = TooltipAlign.Center,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const verticalClasses = placement === TooltipPlacement.Top ? "bottom-full mb-2" : "top-full mt-2";

  const horizontalClasses =
    align === TooltipAlign.Center
      ? "left-1/2 -translate-x-1/2"
      : align === TooltipAlign.Start
        ? "left-0"
        : "right-0";

  return (
    <div className={`inline-flex ${className}`}>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}

        {isVisible && (
          <div
            className={`absolute z-50 ${verticalClasses} ${horizontalClasses} bg-tooltip-bg text-tooltip-foreground rounded-lg px-3 py-1.5 text-xs whitespace-nowrap shadow-lg`}
          >
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
