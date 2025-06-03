/* eslint-disable @typescript-eslint/no-explicit-any */
import Tooltip from "./components/ToolTip";
import { useEffect } from "react";
import { HistoryManager } from "./utils/history/CommandManager";
import { LeftSideBar } from "./components/LeftSideBar";
import { RightSideBar } from "./components/RightSideBar";
import StageContainer from "./components/StageContainer";
import { ShapeRefProvider } from "./contexts/ShapeRefContext";

const App = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        HistoryManager.undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        HistoryManager.redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <LeftSideBar />
      <RightSideBar />

      <Tooltip />
      <ShapeRefProvider>
        <StageContainer />
      </ShapeRefProvider>
    </>
  );
};

export default App;
