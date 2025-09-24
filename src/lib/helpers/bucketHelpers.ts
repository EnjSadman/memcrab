import { CellId, CellValue } from "../../types";
import { MIN_VALUE, MAX_VALUE } from "../../constants/values";

export class BucketManager {
  private buckets: Array<Set<CellId>> = [];

  constructor() {
    this.initializeBuckets();
  }

  private initializeBuckets(): void {
    this.buckets = [];
    for (let i = MIN_VALUE; i <= MAX_VALUE; i++) {
      this.buckets.push(new Set<CellId>());
    }
  }

  private getBucketIndex(value: CellValue): number {
    return value - MIN_VALUE;
  }

  addCell(cellId: CellId, value: CellValue): void {
    const bucketIndex = this.getBucketIndex(value);
    if (bucketIndex >= 0 && bucketIndex < this.buckets.length) {
      this.buckets[bucketIndex].add(cellId);
    }
  }

  removeCell(cellId: CellId, value: CellValue): void {
    const bucketIndex = this.getBucketIndex(value);
    if (bucketIndex >= 0 && bucketIndex < this.buckets.length) {
      this.buckets[bucketIndex].delete(cellId);
    }
  }

  moveCell(cellId: CellId, oldValue: CellValue, newValue: CellValue): void {
    this.removeCell(cellId, oldValue);
    this.addCell(cellId, newValue);
  }

  getCellsForValue(value: CellValue): Set<CellId> {
    const bucketIndex = this.getBucketIndex(value);
    if (bucketIndex >= 0 && bucketIndex < this.buckets.length) {
      return this.buckets[bucketIndex];
    }
    return new Set();
  }

  hasValue(value: CellValue): boolean {
    return this.getCellsForValue(value).size > 0;
  }

  clear(): void {
    this.initializeBuckets();
  }

  getTotalCellCount(): number {
    return this.buckets.reduce((total, bucket) => total + bucket.size, 0);
  }

  getNonEmptyValues(): CellValue[] {
    const values: CellValue[] = [];
    for (let i = 0; i < this.buckets.length; i++) {
      if (this.buckets[i].size > 0) {
        values.push((i + MIN_VALUE) as CellValue);
      }
    }
    return values;
  }
}
