import {
  CellId,
  CellValue,
  RowId,
  ColIndex,
  Cell,
  Row,
  Listener,
} from "../types";
import { MAX_VALUE } from "../constants/values";
import { PositionMapper } from "./helpers/positionHelpers";
import { BucketManager } from "./helpers/bucketHelpers";
import { MatrixListeners } from "./helpers/listenerHelpers";
import { RowCache, StateTracker, VersionedCache } from "./helpers/cacheHelpers";
import { createCell, incrementCellValue } from "./helpers/cellHelpers";
import {
  calculatePercentile,
  findMax,
  findNearestValueCells,
} from "./helpers/mathHelpers";

class MatrixStore {
  private cells = new Map<CellId, Cell>();
  private rows: Row[] = [];
  private rowSums = new Map<RowId, number>();
  private colPercentiles = new Map<ColIndex, number>();
  private nextCellId = 1;
  private nextRowId = 1;
  private numCols = 0;

  private positionMapper = new PositionMapper();
  private bucketManager = new BucketManager();
  private listeners = new MatrixListeners();
  private rowCache = new RowCache();
  private rowPercentModeTracker = new StateTracker();

  private rowMaxCache = new Map<RowId, VersionedCache<number>>();
  private rowPercentagesCache = new Map<
    RowId,
    VersionedCache<Map<CellId, number>>
  >();
  private backgroundComputationInProgress = false;
  private computationQueue = new Set<RowId>();

  private hoveredCellId: CellId | null = null;
  private hoveredNearestIds = new Set<CellId>();
  private nearestHighlightCount = 10;
  private hoveredRowId: RowId | null = null;

  init(M: number, N: number, X: number = 10) {
    this.cells.clear();
    this.rows = [];
    this.rowSums.clear();
    this.colPercentiles.clear();
    this.nextCellId = 1;
    this.nextRowId = 1;
    this.numCols = N;
    this.hoveredCellId = null;
    this.hoveredNearestIds.clear();
    this.hoveredRowId = null;
    this.nearestHighlightCount = X;

    this.positionMapper.clear();
    this.bucketManager.clear();
    this.rowCache.reset();
    this.rowPercentModeTracker.clear();

    this.rowMaxCache.clear();
    this.rowPercentagesCache.clear();
    this.computationQueue.clear();
    this.backgroundComputationInProgress = false;

    for (let rowIndex = 0; rowIndex < M; rowIndex++) {
      const rowId: RowId = `row-${this.nextRowId++}`;
      const cellIds: CellId[] = [];
      let rowSum = 0;

      for (let colIndex = 0; colIndex < N; colIndex++) {
        const cellId: CellId = this.nextCellId++;
        cellIds.push(cellId);

        const cell = createCell(cellId);

        this.positionMapper.set(rowIndex, colIndex, cellId);
        this.cells.set(cellId, cell);
        this.bucketManager.addCell(cellId, cell.amount);
        rowSum += cell.amount;
      }

      const row: Row = { id: rowId, cellIds };
      this.rows.push(row);
      this.rowSums.set(rowId, rowSum);
    }

    for (let colIndex = 0; colIndex < N; colIndex++) {
      this.recomputeColumnPercentile(colIndex);
    }

    this.rowCache.incrementVersion();
    this.listeners.notifyStructure();
    this.listeners.notifyAll();

    this.scheduleBackgroundComputation();
  }

  getCellByPosition(rowIndex: number, colIndex: number): Cell | undefined {
    const cellId = this.positionMapper.getCellId(rowIndex, colIndex);
    if (!cellId) return undefined;
    return this.cells.get(cellId);
  }

  getCellIdByPosition(rowIndex: number, colIndex: number): CellId | undefined {
    return this.positionMapper.getCellId(rowIndex, colIndex);
  }

  getPositionByCellId(
    cellId: CellId
  ): { rowIndex: number; colIndex: number } | undefined {
    return this.positionMapper.getPosition(cellId);
  }

  incrementCell(cellId: CellId) {
    const cell = this.cells.get(cellId);
    if (!cell || cell.amount >= MAX_VALUE) return;

    const oldAmount = cell.amount;
    const newAmount = incrementCellValue(oldAmount);

    cell.amount = newAmount;
    this.bucketManager.moveCell(cellId, oldAmount, newAmount);

    const position = this.positionMapper.getPosition(cellId);
    if (!position) return;

    const row = this.rows[position.rowIndex];
    if (!row) return;

    const currentSum = this.rowSums.get(row.id) || 0;
    this.rowSums.set(row.id, currentSum + 1);

    this.invalidateRowCaches(row.id);

    this.recomputeColumnPercentile(position.colIndex);

    const oldNearestIds = new Set(this.hoveredNearestIds);
    if (this.hoveredCellId) {
      this.recomputeNearestHighlights();
    }

    this.listeners.cell.notify(cellId);
    this.listeners.row.notify(row.id);
    this.listeners.col.notify(position.colIndex);
    this.listeners.notifyHighlightDiff(oldNearestIds, this.hoveredNearestIds);
  }

  addRow(): RowId {
    const rowIndex = this.rows.length;
    const rowId: RowId = `row-${this.nextRowId++}`;
    const cellIds: CellId[] = [];

    const numCols =
      this.rows.length > 0 ? this.rows[0].cellIds.length : this.numCols;
    let rowSum = 0;

    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const cellId: CellId = this.nextCellId++;
      cellIds.push(cellId);

      const cell = createCell(cellId);

      this.positionMapper.set(rowIndex, colIndex, cellId);
      this.cells.set(cellId, cell);
      this.bucketManager.addCell(cellId, cell.amount);
      rowSum += cell.amount;
    }

    const row: Row = { id: rowId, cellIds };
    this.rows.push(row);
    this.rowSums.set(rowId, rowSum);

    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      this.recomputeColumnPercentile(colIndex);
      this.listeners.col.notify(colIndex);
    }

    this.listeners.row.notify(rowId);
    this.rowCache.incrementVersion();
    this.listeners.notifyStructure();

    this.computationQueue.add(rowId);
    if (!this.backgroundComputationInProgress) {
      this.processComputationQueue();
    }

    return rowId;
  }

  removeRow(rowId: RowId) {
    const rowIndex = this.rows.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) {
      return;
    }

    const row = this.rows[rowIndex];

    for (const cellId of row.cellIds) {
      this.listeners.cell.clearKey(cellId);
      this.listeners.highlight.clearKey(cellId);
    }

    for (const cellId of row.cellIds) {
      const cell = this.cells.get(cellId);
      if (cell) {
        this.bucketManager.removeCell(cellId, cell.amount);
        this.cells.delete(cellId);
        this.positionMapper.delete(cellId);

        this.hoveredNearestIds.delete(cellId);
        if (this.hoveredCellId === cellId) {
          this.hoveredCellId = null;
          this.hoveredNearestIds.clear();
        }
      }
    }

    this.rows.splice(rowIndex, 1);
    this.rowSums.delete(rowId);
    this.rowPercentModeTracker.removeState(rowId);

    this.rowMaxCache.delete(rowId);
    this.rowPercentagesCache.delete(rowId);
    this.computationQueue.delete(rowId);

    this.listeners.row.clearKey(rowId);
    this.listeners.rowPercent.clearKey(rowId);
    this.listeners.rowHover.clearKey(rowId);

    if (this.hoveredRowId === rowId) {
      this.hoveredRowId = null;
    }

    for (let i = 0; i < this.rows.length; i++) {
      const currentRow = this.rows[i];

      for (let colIndex = 0; colIndex < currentRow.cellIds.length; colIndex++) {
        const cellId = currentRow.cellIds[colIndex];

        this.positionMapper.delete(cellId);

        this.positionMapper.set(i, colIndex, cellId);
      }
    }

    const numCols =
      this.rows.length > 0 ? this.rows[0].cellIds.length : this.numCols;
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      this.recomputeColumnPercentile(colIndex);
      this.listeners.col.notify(colIndex);
    }

    this.rowCache.incrementVersion();
    this.listeners.notifyStructure();
  }

  setHoveredCell(cellId: CellId | null) {
    if (this.hoveredCellId === cellId) return;

    const oldNearestIds = new Set(this.hoveredNearestIds);
    this.hoveredCellId = cellId;

    if (cellId) {
      this.recomputeNearestHighlights();
    } else {
      this.hoveredNearestIds.clear();
    }

    this.listeners.notifyHighlightDiff(oldNearestIds, this.hoveredNearestIds);
  }

  setHoveredRow(rowId: RowId | null) {
    if (this.hoveredRowId === rowId) return;

    const oldHoveredRowId = this.hoveredRowId;
    this.hoveredRowId = rowId;

    if (oldHoveredRowId) {
      this.listeners.rowHover.notify(oldHoveredRowId);
    }

    if (rowId) {
      this.listeners.rowHover.notify(rowId);
    }
  }

  toggleRowPercentMode(rowId: RowId) {
    this.rowPercentModeTracker.toggleState(rowId);
    this.listeners.rowPercent.notify(rowId);
  }

  nearestIdsForValue(
    targetValue: number,
    maxResults: number,
    excludeCellId?: CellId
  ): CellId[] {
    return findNearestValueCells(
      targetValue as CellValue,
      maxResults,
      (value) => this.bucketManager.getCellsForValue(value),
      excludeCellId
    );
  }

  private recomputeNearestHighlights() {
    this.hoveredNearestIds.clear();

    if (!this.hoveredCellId) return;

    const hoveredCell = this.cells.get(this.hoveredCellId);
    if (!hoveredCell) return;

    const nearestIds = this.nearestIdsForValue(
      hoveredCell.amount,
      this.nearestHighlightCount,
      this.hoveredCellId
    );
    this.hoveredNearestIds = new Set(nearestIds);
  }

  private recomputeColumnPercentile(colIndex: ColIndex) {
    const values: number[] = [];

    for (const row of this.rows) {
      const cellId = row.cellIds[colIndex];
      const cell = this.cells.get(cellId);
      if (cell) {
        values.push(cell.amount);
      }
    }

    if (values.length === 0) {
      this.colPercentiles.set(colIndex, 0);
      return;
    }

    values.sort((a, b) => a - b);
    const percentile = calculatePercentile(values, 95);
    this.colPercentiles.set(colIndex, percentile);
  }

  getCellAmount(cellId: CellId): number {
    return this.cells.get(cellId)?.amount || 0;
  }

  getRowSum(rowId: RowId): number {
    return this.rowSums.get(rowId) || 0;
  }

  getColPercentile(colIndex: ColIndex): number {
    return this.colPercentiles.get(colIndex) || 0;
  }

  isHighlighted(cellId: CellId): boolean {
    return this.hoveredNearestIds.has(cellId);
  }

  isRowPercentMode(rowId: RowId): boolean {
    return this.rowPercentModeTracker.getState(rowId);
  }

  isRowHovered(rowId: RowId): boolean {
    return this.hoveredRowId === rowId;
  }

  getRowMax(rowId: RowId): number {
    let cache = this.rowMaxCache.get(rowId);
    if (!cache) {
      cache = new VersionedCache<number>();
      this.rowMaxCache.set(rowId, cache);
    }

    return cache.getCachedOrGenerate(() => {
      const row = this.rows.find((r) => r.id === rowId);
      if (!row) return 1;

      const values: number[] = [];
      for (const cellId of row.cellIds) {
        const cell = this.cells.get(cellId);
        if (cell) {
          values.push(cell.amount);
        }
      }
      return findMax(values) || 1;
    });
  }

  getRows(): Row[] {
    return this.rowCache.getRows(this.rows);
  }

  getNumCols(): number {
    return this.rows.length > 0 ? this.rows[0].cellIds.length : this.numCols;
  }

  getCurrentMaxValue(): number {
    return MAX_VALUE;
  }

  getCellPercentage(cellId: CellId, rowId: RowId): number {
    let cache = this.rowPercentagesCache.get(rowId);
    if (!cache) {
      cache = new VersionedCache<Map<CellId, number>>();
      this.rowPercentagesCache.set(rowId, cache);
    }

    const percentages = cache.getCachedOrGenerate(() => {
      return this.computeRowPercentages(rowId);
    });

    return percentages.get(cellId) || 0;
  }

  private computeRowPercentages(rowId: RowId): Map<CellId, number> {
    const percentages = new Map<CellId, number>();
    const row = this.rows.find((r) => r.id === rowId);
    if (!row) return percentages;

    const rowSum = this.getRowSum(rowId);
    if (rowSum === 0) return percentages;

    for (const cellId of row.cellIds) {
      const cell = this.cells.get(cellId);
      if (cell) {
        const percentage = (cell.amount / rowSum) * 100;
        percentages.set(cellId, percentage);
      }
    }

    return percentages;
  }

  private invalidateRowCaches(rowId: RowId) {
    const maxCache = this.rowMaxCache.get(rowId);
    if (maxCache) {
      maxCache.incrementVersion();
    }

    const percentCache = this.rowPercentagesCache.get(rowId);
    if (percentCache) {
      percentCache.incrementVersion();
    }
  }

  private scheduleBackgroundComputation() {
    if (this.backgroundComputationInProgress) return;

    this.backgroundComputationInProgress = true;

    for (const row of this.rows) {
      this.computationQueue.add(row.id);
    }

    this.processComputationQueue();
  }

  private async processComputationQueue() {
    while (this.computationQueue.size > 0) {
      const iterator = this.computationQueue.values().next();
      if (iterator.done || !iterator.value) break;

      const rowId = iterator.value;
      this.computationQueue.delete(rowId);

      this.getRowMax(rowId);
      this.computeRowPercentages(rowId);

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    this.backgroundComputationInProgress = false;
  }

  setNearestHighlightCount(X: number) {
    this.nearestHighlightCount = X;

    if (this.hoveredCellId) {
      const oldNearestIds = new Set(this.hoveredNearestIds);
      this.recomputeNearestHighlights();
      this.listeners.notifyHighlightDiff(oldNearestIds, this.hoveredNearestIds);
    }
  }

  subscribeCell(cellId: CellId, listener: Listener): () => void {
    return this.listeners.cell.subscribe(cellId, listener);
  }

  subscribeRow(rowId: RowId, listener: Listener): () => void {
    return this.listeners.row.subscribe(rowId, listener);
  }

  subscribeCol(colIndex: ColIndex, listener: Listener): () => void {
    return this.listeners.col.subscribe(colIndex, listener);
  }

  subscribeHighlight(cellId: CellId, listener: Listener): () => void {
    return this.listeners.highlight.subscribe(cellId, listener);
  }

  subscribeRowPercent(rowId: RowId, listener: Listener): () => void {
    return this.listeners.rowPercent.subscribe(rowId, listener);
  }

  subscribeRowHover(rowId: RowId, listener: Listener): () => void {
    return this.listeners.rowHover.subscribe(rowId, listener);
  }

  subscribeStructure(listener: Listener): () => void {
    return this.listeners.subscribeStructure(listener);
  }
}

export { MatrixStore };
