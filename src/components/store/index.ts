import { createStore } from '@reduxjs/toolkit';
import { State, Action } from '../../react-app-env';
import {
  ADD_ROW, DELETE_ROW, RETURN_STATE, VALUE_CHANGES,
} from './actions';

const initialState : State = {
  m: 0,
  n: 0,
  x: 0,
  arrayOfCells: [],
  arrayOfAverage: [],
  arrayOfSum: [],
};

const reducer = (state = initialState, action : Action) => {
  const tempArr = [...state.arrayOfCells];
  const tempAv = [...state.arrayOfAverage];
  const tempSumm = [...state.arrayOfSum];
  const modifAv : number[] = [];

  switch (action.type) {
    case RETURN_STATE:
      return {
        ...state,
        m: action.payload[0],
        n: action.payload[1],
        x: action.payload[2],
        arrayOfCells: action.payload[3],
        arrayOfAverage: action.payload[4],
        arrayOfSum: action.payload[5],
      };

    case VALUE_CHANGES:
      tempArr[action.payload[0]][action.payload[1]].value += 1;

      tempSumm[action.payload[0]] += 1;

      tempAv[action.payload[1]] = (((tempAv[action.payload[1]] * state.m) + 1) / state.m);

      return {
        ...state,
        arrayOfCells: [...tempArr],
        arrayOfAverage: [...tempAv],
        arrayOfSum: [...tempSumm],
      };

    case DELETE_ROW:
      tempArr[action.payload].forEach((cell, index) => (
        modifAv.push((Math.floor(
          ((tempAv[index] * state.m) - cell.value) / (state.m - 1),
        ) * 100) / 100)
      ));

      tempArr.splice(action.payload, 1);
      tempSumm.splice(action.payload, 1);

      return {
        ...state,
        m: state.m - 1,
        arrayOfCells: [...tempArr],
        arrayOfSum: [...tempSumm],
        arrayOfAverage: [...modifAv],
      };

    case ADD_ROW:
      return {
        ...state,
        m: state.m + 1,
        arrayOfCells: [...tempArr, action.payload],
      };

    default:
      return state;
  }
};

export const store = createStore(reducer);
