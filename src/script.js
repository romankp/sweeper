import { randomizeBool, getProxCells } from './util.js';

const LAT_DIM = 8;
const MINE_CHANCE = 10 / 100;

const field = document.getElementsByTagName('ul')[0];
let fieldSize = LAT_DIM ** 2;
let fieldData = [];

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
      marked: false,
    });

    // Keep track of each cell with a mine
    if (hasMine) {
      mineCells.push(i);
    }
  }

  mineCells.forEach(id => {
    const proxCells = getProxCells(id, LAT_DIM);

    // Process surrounding count
    proxCells.forEach(prox => {
      if (prox >= 0 && prox < fieldSize && !cellData[prox].mine) {
        cellData[prox].count++;
      }
    });
  });

  return cellData;
};

const handleClick = ({ target }) => {
  const { index } = target.dataset;
  const { mine, count } = fieldData[index];
  const indexInt = Number(index);

  if (mine) {
    handleMine(target, indexInt);
  } else {
    if (count) {
      handleCount(target, count, indexInt);
    } else {
      handleEmpty(target, indexInt);
    }
  }
};

const handleRightClick = e => {
  // Prevent context menu
  e.preventDefault();

  const { target } = e;
  const { index } = target.dataset;
  const indexInt = Number(index);

  fieldData[indexInt].marked = true;
  target.classList.add('marked');
  target.children[0].innerText = '!';
};

const handleDoubleClick = e => {
  const { target } = e;
  const { index } = target.dataset;
  const indexInt = Number(index);
  const cell = fieldData[indexInt];

  if (cell.count && !cell.hidden) {
    const proxCells = getProxCells(indexInt, LAT_DIM);
    const markedCells = proxCells.filter(cell => fieldData[cell].marked);

    // If the number of marked cells in the proximity of the clicked cell
    // is the same as its count value, reveal any obscured cells in that proximity.
    // This is meant to mimic the actual game's handy doubleclick feature
    if (markedCells.length === cell.count) {
      proxCells.forEach(cell => {
        const { id, mine, count, hidden, marked } = fieldData[cell];

        if (hidden && !marked) {
          const cellEl = document.getElementsByTagName('li')[id];

          if (mine) {
            handleMine(cellEl, id);
          } else {
            if (count) {
              handleCount(cellEl, count, id);
            } else {
              handleEmpty(cellEl, id);
            }
          }
        }
      });
    }
  }
};

const handleMine = (target, i) => {
  fieldData[i].hidden = false;
  target.classList.remove('hidden');
  target.classList.add('mine');
  target.children[0].innerText = 'X';
};

const handleCount = (target, count, i) => {
  fieldData[i].hidden = false;
  target.classList.remove('hidden');
  target.classList.add('count');
  target.children[0].innerText = `${count}`;
};

const handleEmpty = (target, i) => {
  fieldData[i].hidden = false;
  target.classList.remove('hidden');
  target.classList.add('empty');

  let proxCells = getProxCells(i, LAT_DIM);
  let emptyCells = [];

  // Process surrounding count and empty cells of click target
  proxCells.forEach(prox => {
    if (
      prox >= 0 &&
      prox < fieldSize &&
      !fieldData[prox].mine &&
      fieldData[prox].hidden
    ) {
      const cellEl = document.getElementsByTagName('li')[prox];

      if (fieldData[prox].count) {
        handleCount(cellEl, fieldData[prox].count, prox);
      } else {
        emptyCells.push(prox);
        fieldData[prox].hidden = false;
        cellEl.classList.remove('hidden');
        cellEl.classList.add('empty');
      }
    }
  });

  // Radiate out to reveal adjacent empty and count cells
  while (emptyCells.length > 0) {
    proxCells = getProxCells(emptyCells.shift(), LAT_DIM).filter(
      cell => fieldData[cell].hidden && !fieldData[cell].mine
    );

    proxCells.forEach(prox => {
      if (
        prox >= 0 &&
        prox < fieldSize &&
        !fieldData[prox].mine &&
        fieldData[prox].hidden
      ) {
        const cellEl = document.getElementsByTagName('li')[prox];

        if (fieldData[prox].count) {
          handleCount(cellEl, fieldData[prox].count, prox);
        } else {
          emptyCells.push(prox);
          fieldData[prox].hidden = false;
          cellEl.classList.remove('hidden');
          cellEl.classList.add('empty');
        }
      }
    });
  }
};

// Initialize field data
fieldData = initFieldData(fieldSize);

// Render field
fieldData.map(({ hidden }, i) => {
  const cell = document.createElement('li');
  const content = document.createElement('span');

  cell.setAttribute('data-index', i);
  cell.onclick = handleClick;
  cell.ondblclick = handleDoubleClick;
  cell.oncontextmenu = handleRightClick;

  if (hidden) {
    cell.classList.add('hidden');
  }

  cell.appendChild(content);
  field.appendChild(cell);
});

console.log(fieldData);
