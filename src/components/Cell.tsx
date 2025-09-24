import React, { useCallback } from "react";
import clsx from "clsx";
import { RowId } from "../types";
import {
  useCellAmount,
  useIsHighlighted,
  useIsRowPercentMode,
  useRowSum,
  useRowMax,
  useCellPercentage,
} from "../hooks";
import { useMatrixStore } from "../contexts/MatrixStoreContext";

interface CellProps {
  rowIndex: number;
  colIndex: number;
  rowId: RowId;
}

export const Cell = React.memo(({ rowIndex, colIndex, rowId }: CellProps) => {
  const matrixStore = useMatrixStore();

  const cellId = matrixStore.getCellIdByPosition(rowIndex, colIndex);

  const amount = cellId ? useCellAmount(cellId) : 0;
  const isHighlighted = cellId ? useIsHighlighted(cellId) : false;
  const isRowPercentMode = useIsRowPercentMode(rowId);
  const rowSum = useRowSum(rowId);
  const rowMax = useRowMax(rowId);
  const cachedPercentage = cellId ? useCellPercentage(cellId, rowId) : 0;

  const handleClick = useCallback(() => {
    if (cellId) {
      matrixStore.incrementCell(cellId);
    }
  }, [cellId, matrixStore]);

  const handleMouseEnter = useCallback(() => {
    if (cellId) {
      matrixStore.setHoveredCell(cellId);
    }
  }, [cellId, matrixStore]);

  const handleMouseLeave = useCallback(() => {
    matrixStore.setHoveredCell(null);
  }, [matrixStore]);

  let displayValue: string;
  let cellStyle: React.CSSProperties = {};

  const intensity = rowMax > 0 ? amount / rowMax : 0;
  const isHeatmapLightText = intensity > 0.5;

  if (isRowPercentMode && rowSum > 0) {
    displayValue = `${cachedPercentage.toFixed(1)}%`;

    const heatmapColor = Math.floor(255 * (1 - intensity * 0.7));
    cellStyle.backgroundColor = `rgb(255, ${heatmapColor}, ${heatmapColor})`;
  } else {
    displayValue = amount.toString();
  }

  if (isHighlighted) {
    cellStyle.backgroundColor = "#ffeb3b";
  }

  const className = clsx("cell", {
    "cell--default": !isRowPercentMode && !isHighlighted,
    "cell--heatmap":
      isRowPercentMode && rowSum > 0 && !isHeatmapLightText && !isHighlighted,
    "cell--heatmap-light":
      isRowPercentMode && rowSum > 0 && isHeatmapLightText && !isHighlighted,
    "cell--highlighted": isHighlighted,
  });

  return (
    <div
      className={className}
      style={cellStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayValue}
    </div>
  );
});
