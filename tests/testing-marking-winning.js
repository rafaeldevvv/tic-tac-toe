const winningSets = ["012", "345", "678", "048", "246", "036", "147", "258"];

function isMarkWinning(mark, board) {
  // this will map the winningSets to an array whose items are objects whose
  // properties are the positions and the values are booleans that tell whether
  // the position is taken by the mark
  const mappedWinningSets = winningSets.map((winningSet) => {
    const mappedWinningSet = {};
    [...winningSet].forEach((position) => {
      mappedWinningSet[position] = board[position] === mark;
    });

    return mappedWinningSet;
  });

  // this gets the sets where two out of three positions to win have the mark placed
  const almostWonSets = mappedWinningSets.reduce((sets, currentSet) => {
    const positions = Object.keys(currentSet);

    let count = 0;
    for (const position of positions) {
      if (currentSet[position]) count++;
    }

    const isAlmostWon = count === 2;
    if (isAlmostWon) return [...sets, currentSet];
    else return sets;
  }, []);

  // to get the last position
  function getPositionToWin(almostWonSet) {
    if (!almostWonSet) almostWonSet = {};

    const positions = Object.keys(almostWonSet);
    for (const pos of positions) {
      if (!almostWonSet[pos]) return pos;
    }
  }

  // the positions from the almost won sets to win the game
  const finalPositions = almostWonSets.map(getPositionToWin);

  // there's the possibility that the position required to win is not empty
  // so this reduces to the available winning position or null if there's none
  const positionToWin = finalPositions.reduce((previous, current) => {
    if (board[current] === "") return current;
    else return previous;
  }, null);

  return {
    isMarkInGameWinning: !!positionToWin,
    positionToWin: positionToWin,
  };
}

const testBoard = ["x", "", "x", "", "x", "x", "", "", ""];
console.log(isMarkWinning("x", testBoard));
