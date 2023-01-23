import React, { useState } from 'react';

let LAT = 4;

const populateField = size => {
  let cells = [];
  for (let i = 0; i < size; i++) {
    cells.push(<li key={i}></li>);
  }
  return cells;
};

function Root() {
  const [fieldSize] = useState(LAT ** 2);

  return (
    <>
      <h1>Sweeper</h1>
      <ul>{populateField(fieldSize)}</ul>
    </>
  );
}

export default Root;
