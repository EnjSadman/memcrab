import { State } from '../../react-app-env';

export const getStateSelector = (state : State) => [state.m, state.n, state.x];

export const getCellsSelector = (state : State) => state.arrayOfCells;

export const getAverageSumm = (state : State) => [state.arrayOfAverage, state.arrayOfSum];

export const getXSelector = (state : State) => state.x;
