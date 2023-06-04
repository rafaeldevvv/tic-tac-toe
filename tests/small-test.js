let possiblePositions = [];
const board = new Array(9).fill("");
board.forEach((pos, index) => {
  if (pos === "" || pos === mark) {
    possiblePositions.push(index);
  }
});
possiblePositions = possiblePositions.sort().join("");

console.log(possiblePositions);