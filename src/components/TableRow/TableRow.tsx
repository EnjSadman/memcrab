import React from 'react';
import { useSelector } from 'react-redux';
import { getCellsSelector } from '../store/selectors';
import { TableCell } from '../TableCell/TableCell';

export const TableRow : React.FC = () => {
  const arrayOfCells = useSelector(getCellsSelector);
  const arrayOfCell : any = [];
  const rows = [];

  for (let i = 0; i < arrayOfCells.length; i += 1) {
    console.log(arrayOfCells[i]);
    arrayOfCell[i] = [];
    for (let j = 0; j < arrayOfCells[i].length; j += 1) {
      arrayOfCell[i][j] = <TableCell val={arrayOfCells[i][j].value} id={arrayOfCells[i][j].id} />;
    }

    rows.push(<tr>{arrayOfCell[i]}</tr>);
  }

  console.log(arrayOfCell, arrayOfCells);

  return (
    <>
      {rows}
    </>
  );
};
