import { Cell, CellId, CellValue } from "../../types";
import { MIN_VALUE, MAX_VALUE } from "../../constants/values";

export function generateRandomCellValue(): CellValue {
  return Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
}

export function createCell(cellId: CellId): Cell {
  return {
    id: cellId,
    amount: generateRandomCellValue(),
  };
}

export function isValidCellValue(value: number): value is CellValue {
  return Number.isInteger(value) && value >= MIN_VALUE && value <= MAX_VALUE;
}

export function clampCellValue(value: number): CellValue {
  return Math.max(
    MIN_VALUE,
    Math.min(MAX_VALUE, Math.floor(value))
  ) as CellValue;
}

export function incrementCellValue(currentValue: CellValue): CellValue {
  return Math.min(currentValue + 1, MAX_VALUE) as CellValue;
}

export function decrementCellValue(currentValue: CellValue): CellValue {
  return Math.max(currentValue - 1, MIN_VALUE) as CellValue;
}
