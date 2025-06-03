import { MAX_HISTORY } from "../constants/constants";
import type { History } from "./history.abstract";

/* eslint-disable @typescript-eslint/no-explicit-any */
export class HistoryManager {
  private static historyStack: any[] = [];
  private static pointer: number = -1;
  static isBatching: boolean = false;
  static batchTimeout: number | null = null;

  static log(history: History) {
    if (!this.isBatching) {
      this.historyStack.push([]);
      this.pointer++;
      this.isBatching = true;
    }

    if (this.historyStack.length > MAX_HISTORY) {
      const excess = this.historyStack.length - MAX_HISTORY;
      this.historyStack.splice(0, excess);
      this.pointer -= excess;
      if (this.pointer < -1) this.pointer = -1;
    }

    this.historyStack[this.pointer].push(history);
    this.handleBatchTimeout();
    console.log(this.historyStack);
  }

  static handleBatchTimeout() {
    if (this.batchTimeout) clearTimeout(this.batchTimeout);

    this.batchTimeout = setTimeout(() => {
      this.isBatching = false;
      this.batchTimeout = null;
    }, 0);
  }

  static undo() {
    if (this.pointer >= 0) {
      this.historyStack[this.pointer]
        .slice()
        .reverse()
        .forEach((item: any) => item.undo());
      this.pointer--;
    }
  }

  static redo() {
    if (this.pointer < this.historyStack.length - 1) {
      this.pointer++;
      this.historyStack[this.pointer]
        .slice()
        .reverse()
        .forEach((item: any) => item.redo());
    }
  }

  static reset() {
    this.historyStack = [];
    this.pointer = -1;
  }
}
