import React, { useState } from 'react';

const LAT_DIM = 4;
const MINE_CHANCE = 20 / 100;

const buildFieldData = size => {
  let cellData = [];
  for (let i = 0; i < size; i++) {
    cellData.push({
      hidden: true,
      mine: randomizeBool(MINE_CHANCE),
    });
  }
  console.log(cellData);
  return cellData;
};

const randomizeBool = chanceRatio => {
  return Math.random() > chanceRatio ? false : true;
};

function Root() {
  const [fieldSize] = useState(LAT_DIM ** 2);
  const [fieldData, updateField] = useState(buildFieldData(fieldSize));

  return (
    <>
      <h1>Sweeper</h1>
      <ul>
        {fieldData.map(({ hidden }, i) => (
          <li key={i} className={hidden ? 'hidden' : ''}></li>
        ))}
      </ul>
    </>
  );
}

export default Root;
