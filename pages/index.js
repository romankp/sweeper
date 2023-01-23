import React, { useState } from 'react';

const populateField = size => {
  let cells = [];
  for (let i = 0; i < size; i++) {
    cells.push(<li></li>);
  }
  return cells;
};

function Root() {
  const [fieldSize] = useState(4 * 4);

  return (
    <>
      <h1>Sweeper</h1>
      <ul>{populateField(fieldSize)}</ul>
    </>
  );
}

export default Root;
