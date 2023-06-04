export const winningSets = [
  "012",
  "345",
  "678",
  "048",
  "246",
  "036",
  "147",
  "258",
];

export const strategies = [
  ...winningSets.map((winningSet) => [...winningSet].join(",")),
  "0,4,2,3,6,8",
  "0,1,4,2,8,6",
  "2,4,8,0,6,5",
  "6,8,4,7,2,0",
  "0,1,2,4,5,8",
  "0,1,2,3,4,6",
  "6,7,8,3,4,0",
  "6,7,8,4,5,2",
];

export function getRandomItem(array) {
  if (array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

export function countMarks(board) {
  return board.reduce((count, symbol) => {
    if (symbol !== "") return ++count;
    else return count;
  }, 0);
}

export function calculateNextMarkToPlay(board) {
  const numberOfMarksInGame = countMarks(board);

  if (numberOfMarksInGame % 2 === 0) return "x";
  else return "o";
}

export function getWinner(board) {
  function markWins(symbol) {
    // this is the array of the positions that the symbol takes up in the board
    const indexes = [];
    board.forEach((position, index) => {
      if (position === symbol) {
        indexes.push(String(index));
      }
    });

    // this maps the winningSets array to
    // an array of booleans which say if the
    // symbol is found on the specific positions of a winning set
    const booleans = winningSets.map((winningSet) => {
      const positions = [...winningSet];
      return positions.every((position) => indexes.indexOf(position) >= 0);
    });

    // if the positions of a winning set are found in the positions of a symbol,
    // then it returns true saying that the symbols wins the game.
    return booleans.some((boolean) => boolean === true);
  }

  if (markWins("x")) return "x";
  else if (markWins("o")) return "o";
  else return null;
}