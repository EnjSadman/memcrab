/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-loop-func */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useEffect, useState } from 'react';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import classNames from 'classnames';
import {
  addSingleRow, deleteSingleRow, setChangesToValue, setCurrentState,
} from './components/store/actions';
import { getAverageSumm, getCellsSelector, getXSelector } from './components/store/selectors';

export function getRndInteger(min : number, max : number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function makeAnRow(n : number) {
  const result = [];

  for (let i = 0; i < n; i += 1) {
    result.push({ id: v4(), value: getRndInteger(1, 300) });
  }

  return result;
}

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const arrayOfCells = useSelector(getCellsSelector);
  const avSumm = useSelector(getAverageSumm);
  const stateX = useSelector(getXSelector);
  //  const mainState = useSelector(getStateSelector);
  const [coordsOfLighted, setCoordsOfLighted] = useState<string[] | null>([]);
  const [howeredSumm, setHoveredSumm] = useState<number[] | null>(null);

  useEffect(() => {
    const m = getRndInteger(1, 100);
    const n = getRndInteger(1, 100);

    let x;

    if (m > n) {
      x = getRndInteger(n, m);
    } else {
      x = getRndInteger(m, n);
    }

    const arr : any = new Array(2);
    const average : number[] = [];
    const summ: number[] = [];

    average.length = n;
    average.fill(0);
    summ.length = m;
    summ.fill(0);

    for (let i = 0; i < m; i += 1) {
      arr[i] = makeAnRow(n);
    }

    console.log(summ);

    for (let i = 0; i < arr[0].length - 1; i += 1) {
      for (let j = 0; j < arr.length - 1; j += 1) {
        average[i] += arr[j][i].value;
        summ[j] += arr[j][i].value;
        if ((j + 1) === m) {
          average[j] = (Math.round((average[j] / m) * 100)) / 100;
        }
      }
    }

    dispatch(setCurrentState([m, n, x, arr, average, summ]));
  }, []);

  useEffect(() => {
    console.log(avSumm);
  });

  return (
    <div className="starter">
      <table className="table">
        {arrayOfCells.map((el, rowIndex) => (
          <>
            <tr key={v4()}>
              {el.map((cell, index) => (
                <>
                  <td
                    className="cell"
                    key={cell.id}
                    style={{
                      background: ((howeredSumm !== null) && (rowIndex === howeredSumm[0])) ? (`linear-gradient(90deg, rgba(255,177,0,1) ${Math.round(((cell.value / 100) / howeredSumm[1]) * 100)}%, rgba(255,255,255,1) ${Math.round(((cell.value / 100) / howeredSumm[1]) * 100)}%)`)
                        : 'white',
                    }}
                  >
                    <button
                      type="button"
                      className={classNames('button',
                        {
                          button_close_value:
                          (coordsOfLighted !== null)
                          && (coordsOfLighted.some(coord => coord === cell.id)),
                        })}
                      onClick={() => {
                        dispatch(setChangesToValue([rowIndex, index]));
                      }}
                      onMouseOver={() => {
                        const temp : any = [];
                        let i = 0;

                        while (temp.length <= stateX + 1) {
                          arrayOfCells.forEach(element => (
                            element.find(singleCell => {
                              if ((singleCell.value - i) === cell.value) {
                                temp.push(singleCell.id);
                              }

                              if ((singleCell.value + i) === cell.value) {
                                temp.push(singleCell.id);
                              }
                            })
                          ));

                          i -= 1;

                          if (i === -1000) {
                            break;
                          }

                          setCoordsOfLighted(temp);
                        }
                      }}
                      onMouseOut={() => {
                        setCoordsOfLighted(null);
                      }}
                      onFocus={() => {
                        setCoordsOfLighted(null);
                      }}
                    >
                      {(howeredSumm !== null)
                      && (howeredSumm[0] === rowIndex)
                        ? Math.round(((cell.value / 100) / howeredSumm[1]) * 100)
                        : (cell.value)}
                    </button>
                  </td>
                  {(index === el.length - 1) && (
                    <td>
                      <button
                        type="button"
                        onMouseOver={() => {
                          const temp = avSumm[1][rowIndex] / 100;

                          setHoveredSumm([rowIndex, temp]);
                        }}
                        onMouseOut={() => {
                          setHoveredSumm(null);
                        }}
                        onClick={() => {
                          dispatch(deleteSingleRow(rowIndex));
                        }}
                      >
                        {avSumm[1][rowIndex]}
                      </button>
                    </td>
                  )}
                </>
              ))}
            </tr>
            {(rowIndex === avSumm[1].length - 1) && (
              <tr>
                {avSumm[0].map(average => (
                  <td key={average}>{average}</td>
                ))}
              </tr>
            )}
          </>
        ))}
      </table>
      <button
        type="button"
        onClick={() => {
          dispatch(addSingleRow([]));
        }}
      >
        Add single row
      </button>
    </div>
  );
};
