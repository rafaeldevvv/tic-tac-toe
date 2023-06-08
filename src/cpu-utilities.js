import { winningSets } from "./utilities/sets.js";
import { getRandomItem } from "./utilities/functions.js";

export function isValidStrategy(board, strategy, playingMark) {
  const availableOrMarkedPositions = [];
  board.forEach((pos, index) => {
    if (pos === "" || pos === playingMark) {
      availableOrMarkedPositions.push(String(index));
    }
  });

  return winningSets.some((ws) =>
    [...ws].every(
      (position) =>
        availableOrMarkedPositions.includes(position) &&
        strategy.includes(position)
    )
  );
}

export function getRandomAvailablePosition(board) {
  if (board.filter((pos) => pos === "").length === 0) return null;

  let pos = null;
  const indexes = board.map((_, index) => index);
  do {
    pos = getRandomItem(indexes);
  } while (board[pos] !== "");

  return pos;
}

export function isMarkWinning(board, mark) {
  const markPositions = [];
  // it gets the positions in the board where the mark has been placed
  board.forEach((boardMark, index) => {
    if (boardMark === mark) markPositions.push(String(index));
  });

  // it gets each one of the winning sets and maps it to an
  // object whose properties are the positions of the winning set,
  // and each of these properties has a boolean
  // value which tells whether the position on the board has the mark placed
  const mappedWinningSets = winningSets.map((winningSet) => {
    const mappedWinningSet = {};
    [...winningSet].forEach((position) => {
      mappedWinningSet[position] = markPositions.includes(position);
    });

    return mappedWinningSet;
  });

  // it analyzes each one of the mapped winning sets and returns one if at least
  // one of the mapped winning sets has true for two positions
  // (two of the three positions that make the mark win are placed)
  const almostWonSet = mappedWinningSets.reduce(
    (previousWinningSet, mappedWinningSet) => {
      const positions = Object.keys(mappedWinningSet);
      let count = 0;
      for (const position of positions) {
        if (mappedWinningSet[position]) count++;
      }

      const isAlmostWon = count === 2;
      if (isAlmostWon) return mappedWinningSet;
      else return previousWinningSet;
    },
    null
  );

  // gets the position where the mark must be placed in order to win
  function getPositionToWin(almostWonSet) {
    if (!almostWonSet) almostWonSet = {};
    return Object.keys(almostWonSet).reduce((lastPosition, position) => {
      if (!almostWonSet[position]) return position;
      else return lastPosition;
    }, null);
  }

  const positionToWin = getPositionToWin(almostWonSet);

  // verifies that the mark is really winning
  const isMarkInGameWinning = !!almostWonSet && board[positionToWin] === "";

  // returns an object telling whether the mark is winning
  //  and, if so, also returns the position to place the mark and win.
  return {
    isMarkInGameWinning,
    positionToWin: isMarkInGameWinning ? positionToWin : null,
  };
}
