import { CellId, CellValue } from "../../types";
import { MIN_VALUE, MAX_VALUE } from "../../constants/values";

export function calculatePercentile(
  sortedValues: number[],
  percentile: number
): number {
  if (sortedValues.length === 0) return 0;
  if (sortedValues.length === 1) return sortedValues[0];

  const index = (percentile / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sortedValues[lower];
  }

  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

export function sortAscending(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function findNearestValueCells(
  targetValue: CellValue,
  maxResults: number,
  getBucketCells: (value: CellValue) => Set<CellId>,
  excludeCellId?: CellId
): CellId[] {
  const results: CellId[] = [];
  const visited = new Set<number>();

  const queue = [targetValue];
  let queueIndex = 0;

  while (queueIndex < queue.length && results.length < maxResults) {
    const value = queue[queueIndex++];

    if (visited.has(value) || value < MIN_VALUE || value > MAX_VALUE) {
      continue;
    }

    visited.add(value);

    const bucketCells = getBucketCells(value as CellValue);
    for (const cellId of bucketCells) {
      if (cellId !== excludeCellId && results.length < maxResults) {
        results.push(cellId);
      }
    }

    if (value > MIN_VALUE && !visited.has(value - 1)) {
      queue.push(value - 1);
    }
    if (value < MAX_VALUE && !visited.has(value + 1)) {
      queue.push(value + 1);
    }
  }

  return results;
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function findMax(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values);
}

export function findMin(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.min(...values);
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}
