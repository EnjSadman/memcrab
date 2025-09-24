import { useSyncExternalStore } from "react";
import { useMatrixStore } from "./contexts/MatrixStoreContext";
import { CellId, RowId, ColIndex } from "./types";

export function useCellAmount(cellId: CellId): number {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeCell(cellId, listener),
    () => matrixStore.getCellAmount(cellId)
  );
}

export function useRowSum(rowId: RowId): number {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeRow(rowId, listener),
    () => matrixStore.getRowSum(rowId)
  );
}

export function useIsRowPercentMode(rowId: RowId): boolean {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeRowHover(rowId, listener),
    () => matrixStore.isRowHovered(rowId)
  );
}

export function useIsRowHovered(rowId: RowId): boolean {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeRowHover(rowId, listener),
    () => matrixStore.isRowHovered(rowId)
  );
}

export function useRowMax(rowId: RowId): number {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeRow(rowId, listener),
    () => matrixStore.getRowMax(rowId)
  );
}

export function useColPercentile(colIndex: ColIndex): number {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeCol(colIndex, listener),
    () => matrixStore.getColPercentile(colIndex)
  );
}

export function useIsHighlighted(cellId: CellId): boolean {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeHighlight(cellId, listener),
    () => matrixStore.isHighlighted(cellId)
  );
}

export function useMatrixRows() {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeStructure(listener),
    () => matrixStore.getRows()
  );
}

export function useNumCols(): number {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeStructure(listener),
    () => matrixStore.getNumCols()
  );
}

export function useCellPercentage(cellId: CellId, rowId: RowId): number {
  const matrixStore = useMatrixStore();

  return useSyncExternalStore(
    (listener) => matrixStore.subscribeRow(rowId, listener),
    () => matrixStore.getCellPercentage(cellId, rowId)
  );
}
