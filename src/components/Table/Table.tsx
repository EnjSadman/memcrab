import React from 'react';
import './Table.scss';
import { useSelector } from 'react-redux';
import { getStateSelector } from '../store/selectors';
import { TableRow } from '../TableRow/TableRow';

export const Table : React.FC = () => {
  const nums = useSelector(getStateSelector);
  const rows = [];

  for (let i = 0; i < nums[1]; i += 1) {
    rows.push(
      <TableRow />,
    );
  }

  return (
    <table className="table">
      {rows}
    </table>
  );
};
