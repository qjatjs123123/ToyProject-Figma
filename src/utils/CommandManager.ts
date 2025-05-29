/* eslint-disable @typescript-eslint/no-explicit-any */
export class CommandManager {
  private static history: any[] = [];
  private static pointer: number = -1;
  static isBatching: boolean = false;

  static init() {
    this.history = this.history.slice(0, this.pointer + 1);
    this.history.push([]);
    this.pointer++;
  }

  static execute(command: { execute: () => void; undo: () => void }) {
    command.execute();

    if (this.isBatching) {
      this.history[this.pointer].push(command);
    } else {
      this.history.push([command]);
      this.pointer++;
    }

    const MAX_HISTORY = 40;
    if (this.history.length > MAX_HISTORY) {
      const excess = this.history.length - MAX_HISTORY;
      this.history.splice(0, excess);
      this.pointer -= excess;
      if (this.pointer < -1) this.pointer = -1; 
    }
  }

  static undo() {
    if (this.pointer >= 0) {
      this.history[this.pointer]
        .slice()
        .reverse()
        .forEach((item) => item.undo());
      this.pointer--;
    }
    
  }

  static redo() {
    if (this.pointer < this.history.length - 1) {
      this.pointer++;
      this.history[this.pointer]
        .slice()
        .reverse()
        .forEach((item) => item.execute());
    }
  }

  static reset() {
    this.history = [];
    this.pointer = -1;
  }
}
