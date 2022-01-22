const getRandomBombs = (size, num) => {
  let bombs = {};
  for (let i = 0; i < num; i++) {
    let loc = Math.ceil(size * size * Math.random());
    while (bombs.hasOwnProperty(loc)) {
      loc = Math.ceil(size * size * Math.random());
    }
    bombs[loc] = 1;
  }
  console.log("BOMB", bombs);
  return bombs;
};

module.exports = { getRandomBombs };
