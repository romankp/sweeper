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

  mineCells.forEach(id => {
    // Cells above & below mine
    const proxCells = [id - LAT_DIM, id + LAT_DIM];

    // The mine isn't against the left edge of the field
    if (id !== 0 && id % LAT_DIM !== 0) {
      proxCells.push(id - LAT_DIM - 1, id - 1, id + LAT_DIM - 1);
    }

    // The mine isn't against the right edge of the field
    if ((id + 1) % LAT_DIM !== 0) {
      proxCells.push(id - LAT_DIM + 1, id + 1, id + LAT_DIM + 1);
    }

    // Process surrounding count
    proxCells.forEach(prox => {
      if (prox >= 0 && prox < fieldSize && !cellData[prox].mine) {
        cellData[prox].count++;
      }
    });
  });

  return cellData;
};

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
      handleCount(target, count);
    } else {
      handleEmpty(target);
    }
  }
};

const handleMine = target => {
  target.classList.remove('hidden');
  target.classList.add('mine');
  target.children[0].innerText = 'X';
};

const handleCount = (target, count) => {
  target.classList.remove('hidden');
  target.classList.add('count');
  target.children[0].innerText = `${count}`;
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

  cell.appendChild(content);
  field.appendChild(cell);
});

console.log(fieldData);
