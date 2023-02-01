const LAT_DIM = 4;
const MINE_CHANCE = 20 / 100;

const field = document.getElementsByTagName('ul')[0];
let fieldSize = LAT_DIM ** 2;
let fieldData = [];
// let debug = true;

const initFieldData = size => {
  let cellData = [];

  for (let i = 0; i < size; i++) {
    cellData.push({
      hidden: true,
      mine: randomizeBool(MINE_CHANCE),
      count: 0,
    });
  }

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
      handleCount();
    } else {
      handleEmpty();
    }
  }

  console.log(target);
  console.log(target.dataset);
};

const handleMine = target => {
  target.classList.remove('hidden');
  console.log('MINE -> mine handled');
};

const handleCount = () => {
  target.classList.remove('hidden');
};
const handleEmpty = () => {
  target.classList.remove('hidden');
};

// Initialize field data
fieldData = initFieldData(fieldSize);

// Render field
fieldData.map(({ hidden }, i) => {
  const cell = document.createElement('li');

  cell.setAttribute('data-index', i);
  cell.onclick = handleClick;
  if (hidden) {
    cell.classList.add('hidden');
  }

  field.appendChild(cell);
});

console.log(fieldData);
