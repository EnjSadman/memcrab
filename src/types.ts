export type CellId = number;
export type CellValue = number;
export type RowId = string;
export type ColIndex = number;

export interface Cell {
  id: CellId;
  amount: CellValue;
}

export interface Row {
  id: RowId;
  cellIds: CellId[];
}

export type Listener = () => void;
