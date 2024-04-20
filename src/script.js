import { randomizeBool, getProxCells } from './util.js';

const DIMS = {
  SMALL: 8,
  MED: 12,
  LARGE: 20,
};
const MINE_CHANCE = 18 / 100;

const root = document.querySelector(':root');
const page = document.getElementsByTagName('body')[0];
const field = document.getElementById('field');
const resetButton = document.getElementById('reset');
const sizeButtons = document.getElementsByClassName('size');

let latDim;
let fieldSize;
let fieldData = [];
let fieldCount = 0;
let mineCount = 0;

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

  // Keep track of how many mines are on the field
  mineCount = mineCells.length;

  // Process counts surrounding each mine
  mineCells.forEach(id => {
    getProxCells(id, latDim).forEach(prox => {
      if (prox >= 0 && prox < fieldSize && !cellData[prox].mine) {
        cellData[prox].count++;
      }
    });
  });

  return cellData;
};

const handleClick = ({ target }) => {
  const { index } = target.dataset;
  const { mine, count, hidden } = fieldData[index];
  const indexInt = Number(index);

  // If the single click target isn't hidden, don't do anything
  if (!hidden) {
    return;
  }

  checkAction(mine, target, indexInt, count);
};

const handleRightClick = e => {
  // Prevent context menu
  e.preventDefault();

  const { target } = e;
  const { index } = target.dataset;
  const indexInt = Number(index);
  const cell = fieldData[indexInt];

  if (cell.marked) {
    cell.marked = false;
    target.classList.remove('marked');
    target.children[0].innerText = '';
  } else if (cell.hidden) {
    cell.marked = true;
    target.classList.add('marked');
    target.children[0].innerText = '!';
  }

  checkWin();
};

const handleDoubleClick = e => {
  const { target } = e;
  const { index } = target.dataset;
  const indexInt = Number(index);
  const cell = fieldData[indexInt];

  if (cell.count && !cell.hidden) {
    const proxCells = getProxCells(indexInt, latDim);
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
  commonUpdate(target, i, 'mine');
  page.classList.add('tripped');
  target.children[0].innerText = 'X';
};

const handleCount = (target, count, i) => {
  commonUpdate(target, i, 'count');
  target.children[0].innerText = `${count}`;
};

const handleEmpty = (target, i) => {
  commonUpdate(target, i, 'empty');

  let proxCells = getProxCells(i, latDim);
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
        commonUpdate(cellEl, prox, 'empty');
      }
    }
  });

  // Radiate out to reveal adjacent empty and count cells
  while (emptyCells.length > 0) {
    proxCells = getProxCells(emptyCells.shift(), latDim).filter(
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
          commonUpdate(cellEl, prox, 'empty');
        }
      }
    });
  }
};

const commonUpdate = (el, i, string) => {
  fieldData[i].hidden = false;
  el.classList.remove('hidden');
  el.classList.add(string);
  ++fieldCount;
  checkWin();
};

const checkWin = () => {
  if (fieldCount + mineCount === fieldSize) {
    const markedMines = fieldData.filter(({ marked, mine }) => marked && mine);

    if (markedMines.length === mineCount) {
      page.classList.add('win');
    }
  }
};

const checkAction = (mine, target, indexInt, count) => {
  if (mine) {
    // We prevent the frustration of tripping a mine on the first click
    // by regenerating the field/data and clicking the cell again
    if (!fieldCount) {
      resetField();
      generateField();

      // Check the cell again
      field.children[indexInt].click();
    } else {
      handleMine(target, indexInt);
    }
  } else {
    if (count) {
      handleCount(target, count, indexInt);
    } else {
      handleEmpty(target, indexInt);
    }
  }
};

const resetField = () => {
  // Clear page class
  page.className = '';

  // Remove existing cells
  while (field.firstChild) {
    field.removeChild(field.lastChild);
  }

  // Reset counts
  fieldCount = 0;
  mineCount = 0;
};

const generateField = () => {
  // Initialize field data
  fieldData = initFieldData(fieldSize);

  // Render field
  root.style.setProperty('--dim', latDim);
  fieldData.forEach(({ id }) => {
    const cell = document.createElement('li');
    const content = document.createElement('span');

    cell.classList.add('hidden');
    cell.setAttribute('data-index', id);
    cell.onclick = handleClick;
    cell.ondblclick = handleDoubleClick;
    cell.oncontextmenu = handleRightClick;

    cell.appendChild(content);
    field.appendChild(cell);
  });

  console.log(fieldData);
};

const checkCookie = (string = 'SMALL', useSaved = true) => {
  const sizeCookie = document.cookie
    .split(';')
    .filter(string => string.includes('size='));
  const sizeString = sizeCookie.length && sizeCookie[0].trim().split('=')[1];

  console.log(sizeString);

  if (sizeString && useSaved) {
    latDim = DIMS[sizeString];
    fieldSize = latDim ** 2;
  } else {
    latDim = DIMS[string];
    fieldSize = latDim ** 2;
    document.cookie = `size=${string}`;
  }
};

// Size button listener
Array.from(sizeButtons).forEach(button => {
  button.onclick = ({ target }) => {
    resetField();
    checkCookie(target.getAttribute('data-size'), false);
    generateField();
  };
});

// Reset button listener
resetButton.onclick = e => {
  resetField();
  generateField();
};

// Generate initial field
checkCookie();
generateField();
