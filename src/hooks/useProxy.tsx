/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { CreateCommand } from "../utils/trash/CreateCommand";
import { CommandManager } from "../utils/trash/CommandManager";

export function useProxy([atom, setAtom]: any) {
  const setAtomProxy = useCallback(
    (updater: any) => {
      const command = new CreateCommand(atom, setAtom, updater);
      CommandManager.execute(command);
    },
    [setAtom]
  );

  return [atom, setAtomProxy] as const;
}
