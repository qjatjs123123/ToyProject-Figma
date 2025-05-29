/* eslint-disable @typescript-eslint/no-explicit-any */
export class CommandManager {
  private static history: any[] = [];
  private static pointer: number = -1;
  static isBatching: boolean = false;

  static init() {
    this.history.push([]);
    this.pointer++;
  }

  static execute(command: { execute: () => void; undo: () => void }) {
    command.execute();

    this.history = this.history.slice(0, this.pointer + 1);
    if (this.isBatching) {
      this.history[this.pointer].push(command);
    } else {
      this.history.push([command]);
      this.pointer++;
    }

  }

  static undo() {
    if (this.pointer >= 0) {
      this.history[this.pointer].slice().reverse().forEach((item) => item.undo());

      this.pointer--;
    }
  }

  static redo() {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      this.history[this.pointer].slice().reverse().forEach((item) => item.execute())
    }
  }

  static reset() {
    this.history = [];
    this.pointer = -1;
  }
}
