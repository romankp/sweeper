const LAT_DIM = 4;
const MINE_CHANCE = 20 / 100;

// const buildFieldData = size => {
//   let cellData = [];
//   for (let i = 0; i < size; i++) {
//     cellData.push({
//       hidden: true,
//       mine: randomizeBool(MINE_CHANCE),
//     });
//   }
//   console.log(cellData);
//   return cellData;
// };

// const randomizeBool = chanceRatio => {
//   return Math.random() > chanceRatio ? false : true;
// };

// function Root() {
//   const [fieldSize] = useState(LAT_DIM ** 2);
//   const [fieldData, updateField] = useState(buildFieldData(fieldSize));

//   const handleClick = ({ target }) => {
//     console.log(target.getAttribute('data-index'));
//     console.log(fieldData[target.getAttribute('data-index')]);
//   };
// }
