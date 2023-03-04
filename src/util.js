const randomizeBool = chanceRatio => {
  return Math.random() > chanceRatio ? false : true;
};

const getProxCells = (i, dim) => {
  // Cells above & below mine
  const cells = [i - dim, i + dim];

  // The mine isn't against the left edge of the field
  if (i !== 0 && i % dim !== 0) {
    cells.push(i - dim - 1, i - 1, i + dim - 1);
  }

  // The mine isn't against the right edge of the field
  if ((i + 1) % dim !== 0) {
    cells.push(i - dim + 1, i + 1, i + dim + 1);
  }

  return cells;
};

export { randomizeBool, getProxCells };
