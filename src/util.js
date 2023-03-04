const randomizeBool = chanceRatio => {
  return Math.random() > chanceRatio ? false : true;
};

export { randomizeBool };
