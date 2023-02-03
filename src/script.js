const LAT_DIM = 4;
const MINE_CHANCE = 20 / 100;

const field = document.getElementsByTagName('ul')[0];
let fieldSize = LAT_DIM ** 2;
let fieldData = [];
// let debug = true;

const initFieldData = size => {
  let cellData = [];
  let mineCells = [];

  for (let i = 0; i < size; i++) {
    const hasMine = randomizeBool(MINE_CHANCE);

    cellData.push({
      id: i,
      hidden: true,
      count: 0,
      mine: hasMine,
    });

    // Keep track of each cell with a mine
    if (hasMine) {
      mineCells.push(i);
    }
  }

  console.log(mineCells);

  mineCells.forEach(id => {
    // Surrounding cells, from NW, clockwise
    const proxCells = [
      id - LAT_DIM - 1,
      id - LAT_DIM,
      id - LAT_DIM + 1,
      id + 1,
      id + LAT_DIM + 1,
      id + LAT_DIM,
      id + LAT_DIM - 1,
      id - 1,
    ];

    proxCells.forEach(prox => {
      // console.log(prox);
      // console.log(prox >= 0);
      if (prox >= 0 && prox < fieldSize && !cellData[prox].mine) {
        // console.log(cellData[prox]);
        cellData[prox].count++;
      }
    });
  });

  return cellData;
};

const setCount = array => {};

const randomizeBool = chanceRatio => {
  return Math.random() > chanceRatio ? false : true;
};

const handleClick = ({ target }) => {
  const { index } = target.dataset;
  const { mine, count } = fieldData[index];

  if (mine) {
    handleMine(target);
  } else {
    if (count) {
      handleCount(target);
    } else {
      handleEmpty(target);
    }
  }

  console.log(target);
  console.log(target.dataset);
};

const handleMine = target => {
  target.classList.remove('hidden');
  target.classList.add('mine');
  console.log('MINE -> mine handled');
};

const handleCount = target => {
  target.classList.remove('hidden');
};
const handleEmpty = target => {
  target.classList.remove('hidden');
};

// Initialize field data
fieldData = initFieldData(fieldSize);

// Render field
fieldData.map(({ hidden }, i) => {
  const cell = document.createElement('li');
  const content = document.createElement('span');

  cell.setAttribute('data-index', i);
  cell.onclick = handleClick;
  if (hidden) {
    cell.classList.add('hidden');
  }

  field.appendChild(cell);
});

console.log(fieldData);
