import React, { useState, useEffect } from "react";
import { useMatrixRows, useNumCols } from "../hooks";
import { Cell } from "./Cell";
import { RowSum } from "./RowSum";
import { MatrixControls } from "./MatrixControls";
import { useMatrixStore } from "../contexts/MatrixStoreContext";
import { MATRIX_DEFAULTS } from "../constants/values";
import { RowId } from "../types";

export const Matrix = React.memo(() => {
  const matrixStore = useMatrixStore();

  const { M, N, X } = MATRIX_DEFAULTS;

  const rows = useMatrixRows();
  const numCols = useNumCols();
  const [currentM, setCurrentM] = useState(M);
  const [currentN, setCurrentN] = useState(N);
  const [currentX, setCurrentX] = useState(X);

  useEffect(() => {
    setCurrentM(rows.length);
    setCurrentN(numCols);
  }, [rows.length, numCols]);

  const handleAddRow = () => {
    matrixStore.addRow();
  };

  const handleRemoveRow = (rowId: RowId) => {
    matrixStore.removeRow(rowId);
  };

  const handleRemoveLastRow = () => {
    if (rows.length > 1) {
      const lastRow = rows[rows.length - 1];
      matrixStore.removeRow(lastRow.id);
    }
  };

  return (
    <div className="matrix-container">
      <div className="matrix-title">MemCrab Matrix</div>

      <MatrixControls
        currentM={currentM}
        currentN={currentN}
        currentX={currentX}
        onXChange={setCurrentX}
      />

      <div>
        <button className="matrix-button" onClick={handleAddRow}>
          Add Row
        </button>
        <button
          className="matrix-button"
          onClick={handleRemoveLastRow}
          disabled={rows.length <= 1}
        >
          Remove Last Row
        </button>
      </div>

      <div className="matrix-grid">
        {rows.map((row, rowIndex) => (
          <div key={row.id} className="matrix-row">
            {row.cellIds.map((cellId, colIndex) => (
              <Cell
                key={cellId}
                rowIndex={rowIndex}
                colIndex={colIndex}
                rowId={row.id}
              />
            ))}
            <RowSum rowId={row.id} />
            <button
              className="remove-row-button"
              onClick={() => handleRemoveRow(row.id)}
            >
              Remove
            </button>
          </div>
        ))}
        {numCols > 0 && (
          <div className="matrix-row percentile-row">
            {Array.from({ length: numCols }, (_, colIndex) => (
              <div
                key={`percentile-${colIndex}`}
                className="cell percentile-cell"
              >
                {matrixStore.getColPercentile(colIndex).toFixed(1)}
              </div>
            ))}
            <div className="percentile-label row-sum">60th %ile</div>
          </div>
        )}
      </div>
    </div>
  );
});
