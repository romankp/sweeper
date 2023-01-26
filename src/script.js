const LAT_DIM = 4;
const MINE_CHANCE = 20 / 100;

const field = document.getElementsByTagName('ul')[0];
let fieldSize = LAT_DIM ** 2;
let fieldData = [];

const initFieldData = size => {
  let cellData = [];
  for (let i = 0; i < size; i++) {
    cellData.push({
      hidden: true,
      mine: randomizeBool(MINE_CHANCE),
    });
  }
  return cellData;
};

const randomizeBool = chanceRatio => {
  return Math.random() > chanceRatio ? false : true;
};

// Initialize field data
fieldData = initFieldData(fieldSize);

// Render field
fieldData.map(({ hidden }, i) => {
  const cell = document.createElement('li');

  cell.setAttribute('data-index', i);
  if (hidden) {
    cell.classList.add('hidden');
  }

  field.appendChild(cell);
});

console.log(fieldData);
