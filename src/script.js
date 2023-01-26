const LAT_DIM = 4;
const MINE_CHANCE = 20 / 100;

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

fieldData = initFieldData(fieldSize);

console.log(fieldData);
