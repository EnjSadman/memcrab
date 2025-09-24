import React, { useCallback } from "react";
import clsx from "clsx";
import { RowId } from "../types";
import { useRowSum, useIsRowHovered } from "../hooks";
import { useMatrixStore } from "../contexts/MatrixStoreContext";

interface RowSumProps {
  rowId: RowId;
}

export const RowSum = React.memo(({ rowId }: RowSumProps) => {
  const matrixStore = useMatrixStore();

  const sum = useRowSum(rowId);
  const isHovered = useIsRowHovered(rowId);

  const handleMouseEnter = useCallback(() => {
    matrixStore.setHoveredRow(rowId);
  }, [rowId, matrixStore]);

  const handleMouseLeave = useCallback(() => {
    matrixStore.setHoveredRow(null);
  }, [matrixStore]);

  const className = clsx(
    "row-sum",
    isHovered ? "row-sum--hovered" : "row-sum--default"
  );

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered ? "% Mode" : sum}
    </div>
  );
});
