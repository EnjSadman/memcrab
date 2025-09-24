import { CellId, RowId, ColIndex, Listener } from "../../types";

export class ListenerManager<T extends string | number> {
  private listeners = new Map<T, Set<Listener>>();

  subscribe(key: T, listener: Listener): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(listener);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  notify(key: T): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach((listener) => listener());
    }
  }

  notifyAll(): void {
    this.listeners.forEach((keyListeners) => {
      keyListeners.forEach((listener) => listener());
    });
  }

  clearKey(key: T): void {
    this.listeners.delete(key);
  }

  clear(): void {
    this.listeners.clear();
  }

  getListenerCount(key: T): number {
    return this.listeners.get(key)?.size || 0;
  }

  getTotalListenerCount(): number {
    let total = 0;
    this.listeners.forEach((keyListeners) => {
      total += keyListeners.size;
    });
    return total;
  }

  hasListeners(key: T): boolean {
    return this.getListenerCount(key) > 0;
  }
}

export class MatrixListeners {
  readonly cell = new ListenerManager<CellId>();
  readonly row = new ListenerManager<RowId>();
  readonly col = new ListenerManager<ColIndex>();
  readonly highlight = new ListenerManager<CellId>();
  readonly rowPercent = new ListenerManager<RowId>();
  readonly rowHover = new ListenerManager<RowId>();
  readonly structure = new Set<Listener>();

  subscribeStructure(listener: Listener): () => void {
    this.structure.add(listener);

    return () => {
      this.structure.delete(listener);
    };
  }

  notifyStructure(): void {
    this.structure.forEach((listener) => listener());
  }

  notifyAll(): void {
    this.cell.notifyAll();
    this.row.notifyAll();
    this.col.notifyAll();
    this.highlight.notifyAll();
    this.rowPercent.notifyAll();
    this.rowHover.notifyAll();
    this.notifyStructure();
  }

  clearAll(): void {
    this.cell.clear();
    this.row.clear();
    this.col.clear();
    this.highlight.clear();
    this.rowPercent.clear();
    this.rowHover.clear();
    this.structure.clear();
  }

  notifyHighlightDiff(oldSet: Set<CellId>, newSet: Set<CellId>): void {
    for (const cellId of oldSet) {
      if (!newSet.has(cellId)) {
        this.highlight.notify(cellId);
      }
    }

    for (const cellId of newSet) {
      if (!oldSet.has(cellId)) {
        this.highlight.notify(cellId);
      }
    }
  }
}
