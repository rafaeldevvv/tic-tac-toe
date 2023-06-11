 const winningSets = [
  "012",
  "345",
  "678",
  "048",
  "246",
  "036",
  "147",
  "258",
];

function getWinningSet(board, winnerMark) {
  const winnerPositions = [];
  board.forEach((pos, index) => {
    if (pos === winnerMark) winnerPositions.push(String(index));
  });

  const filtered = winningSets.filter((ws) =>
    [...ws].every((pos) => winnerPositions.includes(pos))
  );

  return filtered[0];
}

console.log(getWinningSet(["x", "x", "x", "x", "", "", "", "", ""], "x"));
