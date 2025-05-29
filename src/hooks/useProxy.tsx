/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";

export function useProxy([atom, setAtom]: any) {
  const setAtomProxy = useCallback(
    (updater: any) => {
      setAtom((prev: any) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    },
    [setAtom]
  );

  return [atom, setAtomProxy] as const;
}
