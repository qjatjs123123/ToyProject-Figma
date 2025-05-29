/* eslint-disable @typescript-eslint/no-explicit-any */
export class CommandManager {
  private static history: any[] = [];
  private static pointer: number = -1;

  static execute(command: { execute: () => void; undo: () => void }) {
    command.execute();
    this.history = this.history.slice(0, this.pointer + 1);
    this.history.push(command);
    this.pointer++;
    console.log(this.history);
  }

  static undo() {
    if (this.pointer >= 0) {
      this.history[this.pointer].undo();
      this.pointer--;
    }
  }

  static redo() {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      this.history[this.pointer].execute();
    }
  }

  static reset() {
    this.history = [];
    this.pointer = -1;
  }
}
