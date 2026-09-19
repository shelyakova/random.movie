"use client";

import { useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}
