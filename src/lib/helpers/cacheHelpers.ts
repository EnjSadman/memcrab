import { Row } from "../../types";

export class VersionedCache<T> {
  private cachedData: T | null = null;
  private cachedVersion = -1;
  private currentVersion = 0;

  incrementVersion(): number {
    this.currentVersion++;
    return this.currentVersion;
  }

  getCurrentVersion(): number {
    return this.currentVersion;
  }

  setCachedData(data: T): void {
    this.cachedData = data;
    this.cachedVersion = this.currentVersion;
  }

  getCachedData(): T | null {
    if (this.cachedVersion === this.currentVersion) {
      return this.cachedData;
    }
    return null;
  }

  getCachedOrGenerate(generator: () => T): T {
    const cached = this.getCachedData();
    if (cached !== null) {
      return cached;
    }

    const generated = generator();
    this.setCachedData(generated);
    return generated;
  }

  isValid(): boolean {
    return this.cachedVersion === this.currentVersion;
  }

  clear(): void {
    this.cachedData = null;
    this.cachedVersion = -1;
  }

  reset(): void {
    this.currentVersion = 0;
    this.clear();
  }
}

export class RowCache extends VersionedCache<Row[]> {
  getRows(rows: Row[]): Row[] {
    return this.getCachedOrGenerate(() => [...rows]);
  }
}

export class StateTracker {
  private states = new Map<string, boolean>();

  setState(key: string, value: boolean): boolean {
    const oldValue = this.states.get(key) || false;
    this.states.set(key, value);
    return oldValue !== value;
  }

  getState(key: string): boolean {
    return this.states.get(key) || false;
  }

  toggleState(key: string): boolean {
    const newValue = !this.getState(key);
    this.setState(key, newValue);
    return newValue;
  }

  removeState(key: string): void {
    this.states.delete(key);
  }

  clear(): void {
    this.states.clear();
  }

  getKeysWithState(value: boolean): string[] {
    const keys: string[] = [];
    this.states.forEach((stateValue, key) => {
      if (stateValue === value) {
        keys.push(key);
      }
    });
    return keys;
  }
}
