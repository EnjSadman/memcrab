import { CellId } from "../../types";

export function createPositionKey(rowIndex: number, colIndex: number): string {
  return `${rowIndex}-${colIndex}`;
}

export function parsePositionKey(
  positionKey: string
): { rowIndex: number; colIndex: number } | null {
  const parts = positionKey.split("-");
  if (parts.length !== 2) return null;

  const rowIndex = parseInt(parts[0], 10);
  const colIndex = parseInt(parts[1], 10);

  if (isNaN(rowIndex) || isNaN(colIndex)) return null;

  return { rowIndex, colIndex };
}

export function createRowId(rowIndex: number): string {
  return `row-${rowIndex}`;
}

export function parseRowId(rowId: string): number | null {
  const match = rowId.match(/^row-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export class PositionMapper {
  private positionToCellId = new Map<string, CellId>();
  private cellIdToPosition = new Map<
    CellId,
    { rowIndex: number; colIndex: number }
  >();

  set(rowIndex: number, colIndex: number, cellId: CellId): void {
    const positionKey = createPositionKey(rowIndex, colIndex);
    this.positionToCellId.set(positionKey, cellId);
    this.cellIdToPosition.set(cellId, { rowIndex, colIndex });
  }

  getCellId(rowIndex: number, colIndex: number): CellId | undefined {
    const positionKey = createPositionKey(rowIndex, colIndex);
    return this.positionToCellId.get(positionKey);
  }

  getPosition(
    cellId: CellId
  ): { rowIndex: number; colIndex: number } | undefined {
    return this.cellIdToPosition.get(cellId);
  }

  delete(cellId: CellId): void {
    const position = this.cellIdToPosition.get(cellId);
    if (position) {
      const positionKey = createPositionKey(
        position.rowIndex,
        position.colIndex
      );
      this.positionToCellId.delete(positionKey);
      this.cellIdToPosition.delete(cellId);
    }
  }

  clear(): void {
    this.positionToCellId.clear();
    this.cellIdToPosition.clear();
  }
}
