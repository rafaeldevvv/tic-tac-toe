import { winningSets } from "./sets.js";

export function getRandomItem(array) {
  if (array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

export function getWinningSet(board, winnerMark) {
  const winnerPositions = [];
  board.forEach((pos, index) => {
    if (pos === winnerMark) winnerPositions.push(String(index));
  });

  const filtered = winningSets.filter((ws) =>
    [...ws].every((pos) => winnerPositions.includes(pos))
  );

  return filtered[0];
}

export function getRandomAvailablePosition(board) {
  if (board.filter((pos) => pos === "").length === 0) return null;

  let pos = null;
  let indexes = board.map((_, index) => index);
  do {
    pos = getRandomItem(indexes);
    indexes = indexes.filter((i) => i !== pos);
  } while (board[pos] !== "");

  return pos;
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
  function markWins(mark) {
    // this is the array of the positions that the mark takes up in the board
    const markPositions = [];
    board.forEach((position, index) => {
      if (position === mark) {
        markPositions.push(String(index));
      }
    });

    // if some winning set has all its positions placed by the specific mark
    return winningSets.some((ws) => {
      const positions = [...ws];
      return positions.every((pos) => markPositions.includes(pos));
    });
  }

  if (markWins("x")) return "x";
  else if (markWins("o")) return "o";
  else return null;
}

export function isMarkWinning(board, mark) {
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
