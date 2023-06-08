import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

export function Score({ score }) {
  return (
    <div className="score-container">
      <div className="score-box-left score-box">
        <span className="little-text">X</span>
        <span className="score-number">{score.x || "-"}</span>
      </div>
      <div className="score-box score-box-middle">
        <span className="little-text">TIES</span>
        <span className="score-number">{score.ties || "-"}</span>
      </div>
      <div className="score-box-right score-box">
        <span className="little-text">O</span>
        <span className="score-number">{score.o || "-"}</span>
      </div>
    </div>
  );
}

export function Board({ onClickOnSquare, board, isClickable }) {
  return (
    <div className="board">
      {board.map((mark, i) => (
        <div
          className="square"
          key={i}
          onClick={() => {
            if (isClickable) {
              onClickOnSquare(i);
            }
          }}
        >
          {mark !== "" && (
            <img
              src={"./images/" + mark + ".png"}
              className="mark"
              alt={mark}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function BoardBottom({ onRestartGame, onQuitGame, turnMark }) {
  return (
    <div className="board-bottom">
      <div className="buttons">
        <button className="red-btn btn" onClick={onQuitGame}>
          Quit
        </button>
        <button className="blue-btn btn" onClick={onRestartGame}>
          <span className="sr-only">Restart Game</span>
          <FontAwesomeIcon icon={icon({ name: "rotate-left" })} />
        </button>
      </div>
      <span className="btn yellow-btn turn-warning">
        <span className="mark">{turnMark}</span>
        Turn
      </span>
    </div>
  );
}

export default function Game({
  score,
  onClickOnSquare,
  board,
  onRestartGame,
  onQuitGame,
  isClickable,
  turnMark,
}) {
  return (
    <div id="game">
      <Score score={score} />
      <Board
        onClickOnSquare={onClickOnSquare}
        board={board}
        isClickable={isClickable}
      />
      <BoardBottom
        onRestartGame={onRestartGame}
        onQuitGame={onQuitGame}
        turnMark={turnMark}
      />
    </div>
  );
}
