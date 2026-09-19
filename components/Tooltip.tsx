"use client";

import { useState, FocusEvent, ReactNode } from "react";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isVisible = isHovered || isFocused;

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    try {
      setIsFocused(event.target.matches(":focus-visible"));
    } catch {
      setIsFocused(true);
    }
  };

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
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
