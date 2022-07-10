/// <reference types="react-scripts" />

export interface State {
  m: number,
  n: number,
  x: number,
  arrayOfCells: Cell[][],
  arrayOfAverage: number[],
  arrayOfSum: number[],
}

export interface Cell {
  id: string,
  value: number,
}

export interface Action {
  type: string,
  payload: any,
}
