import React, { useState } from "react";
import clsx from "clsx";
import { useMatrixStore } from "../contexts/MatrixStoreContext";

interface MatrixControlsProps {
  currentM: number;
  currentN: number;
  currentX: number;
  onXChange: (newX: number) => void;
}

export const MatrixControls = React.memo(
  ({ currentM, currentN, currentX, onXChange }: MatrixControlsProps) => {
    const matrixStore = useMatrixStore();

    const [M, setM] = useState(currentM);
    const [N, setN] = useState(currentN);
    const [X, setX] = useState(currentX);

    const isValidRange = (value: number, min: number, max: number) => {
      return value >= min && value <= max;
    };

    const areAllValuesValid = () => {
      return (
        isValidRange(M, 1, 100) &&
        isValidRange(N, 1, 100) &&
        isValidRange(X, 1, 100)
      );
    };

    const handleReinitialize = () => {
      if (!areAllValuesValid()) return;

      matrixStore.init(M, N, X);
      onXChange(X);
    };

    const handleXChange = (newX: number) => {
      const clampedX = Math.max(1, Math.min(100, newX));
      setX(clampedX);
      matrixStore.setNearestHighlightCount(clampedX);
      onXChange(clampedX);
    };

    const buttonClassName = clsx(
      "controls-button",
      areAllValuesValid()
        ? "controls-button--enabled"
        : "controls-button--disabled"
    );

    return (
      <div className="controls-container">
        <div className="controls-input-group">
          <label className="controls-label">Rows (M)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={M}
            onChange={(e) => setM(parseInt(e.target.value) || 1)}
            className="controls-input"
          />
          <div className="controls-description">1-100</div>
        </div>

        <div className="controls-input-group">
          <label className="controls-label">Cols (N)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={N}
            onChange={(e) => setN(parseInt(e.target.value) || 1)}
            className="controls-input"
          />
          <div className="controls-description">1-100</div>
        </div>

        <div className="controls-input-group">
          <label className="controls-label">Nearest (X)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={X}
            onChange={(e) => handleXChange(parseInt(e.target.value) || 1)}
            className="controls-input"
          />
          <div className="controls-description">1-100</div>
        </div>

        <button
          className={buttonClassName}
          onClick={handleReinitialize}
          disabled={!areAllValuesValid()}
        >
          Generate New Matrix
        </button>
      </div>
    );
  }
);
