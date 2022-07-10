import { Action } from '../../react-app-env';

export const RETURN_STATE = 'RETURN_STATE';
export const VALUE_CHANGES = 'VALUE_CHANGES';
export const DELETE_ROW = 'DELETE_ROW';
export const ADD_ROW = 'ADD_ROW';

export const setCurrentState = (payload : any[]) : Action => ({
  type: RETURN_STATE,
  payload,
});

export const setChangesToValue = (payload : number[]) : Action => ({
  type: VALUE_CHANGES,
  payload,
});

export const deleteSingleRow = (payload : number) : Action => ({
  type: DELETE_ROW,
  payload,
});

export const addSingleRow = (payload : any) : Action => ({
  type: ADD_ROW,
  payload,
});
