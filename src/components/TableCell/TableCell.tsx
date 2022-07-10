import React, { useState } from 'react';
import './TableCell.scss';

interface Props {
  val: number,
  id: string,
}

export const TableCell : React.FC<Props> = ({ val, id }) => {
  const [value, setValue] = useState(val);

  return (
    <td key={id}>
      <button
        className="button"
        type="button"
        onClick={() => {
          setValue(value + 1);
        }}
      >
        {value}
      </button>
    </td>
  );
};
