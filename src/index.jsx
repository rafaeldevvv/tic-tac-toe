import { createRoot } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";
import {
  getWinner,
  calculateNextMarkToPlay,
  cpuPlay,
  countMarks,
} from "./utilities.js";
const { useState, Fragment } = React;

function TicTacToe({ initialScore }) {
  const [chosenSymbol, setChosenSymbol] = useState("x");
  const [status, setStatus] = useState("choosing");
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(initialScore);
  const [mode, setMode] = useState(null);

  const [board, setBoard] = useState(new Array(9).fill(""));

  function handleClickOnSquare(index) {
    const nextBoard = [...board];
    const nextMarkToPlay = calculateNextMarkToPlay(board);
    if (nextBoard[index] === "") {
      nextBoard[index] = nextMarkToPlay;
    }

    let winner = getWinner(nextBoard);

    if (mode === "vs-cpu" && winner === null) {
      cpuPlay(nextBoard, nextMarkToPlay === "x" ? "o" : "x");
    }

    setBoard(nextBoard);

    winner = getWinner(nextBoard);
    const numberOfMarksPlayed = countMarks(nextBoard);

    if (!!winner || numberOfMarksPlayed === 9) {
      handleEndGame(winner);
    }
  }

  function updateScore(category) {
    const nextScore = { ...score };
    if (!!category) {
      nextScore[category]++;
    }

    setScore(nextScore);
    localStorage.setItem("score", JSON.stringify(nextScore));
  }

  function handleEndGame(winner) {
    setWinner(winner);
    setStatus("finished");
    updateScore(winner || "ties");
  }

  function handleStart(mode) {
    setStatus("playing");
    setMode(mode);
    if (mode === "vs-cpu" && chosenSymbol === "o") {
      const firstBoard = [...board];
      cpuPlay(firstBoard, "x");
      setBoard(firstBoard);
    }
  }

  function handleRestartGame() {
    if (status !== "playing") setStatus("playing");

    let nextBoard = new Array(9).fill("");
    if (mode === "vs-cpu" && chosenSymbol === "o") {
      cpuPlay(nextBoard, "x");
    }
    setBoard(nextBoard);
  }

  function handleQuitGame() {
    setStatus("choosing");
    setBoard(new Array(9).fill(""));
    setWinner(null);
    setMode(null);
  }

  const isChoosing = status === "choosing";
  const isPlaying = status === "playing";
  const isFinished = status === "finished";

  return (
    <div>
      <Header />
      <main>
        <section id="tic-tac-toe">
          <h2 className="sr-only">Game</h2>
          <div className="container">
            {isChoosing && (
              <InitialScreen
                onStart={handleStart}
                onChooseSymbol={setChosenSymbol}
                chosenSymbol={chosenSymbol}
              />
            )}
            {(isPlaying || isFinished) && (
              <Game
                score={score}
                board={board}
                onClickOnSquare={handleClickOnSquare}
                onRestartGame={handleRestartGame}
                onQuitGame={handleQuitGame}
                isClickable={status !== "finished"}
                turnMark={calculateNextMarkToPlay(board)}
              />
            )}
            {isFinished && (
              <FinalScreen
                winner={winner}
                onRestartGame={handleRestartGame}
                onQuitGame={handleQuitGame}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function InitialScreen({ onStart, onChooseSymbol, chosenSymbol }) {
  return (
    <div id="initial-screen">
      <div className="container">
        <h3>Pick a Mark</h3>
        <div className="choices">
          <button
            className={"choice " + (chosenSymbol === "x" ? "selected" : "")}
            onClick={() => onChooseSymbol("x")}
          >
            X
          </button>
          <button
            className={"choice " + (chosenSymbol === "o" ? "selected" : "")}
            onClick={() => onChooseSymbol("o")}
          >
            O
          </button>
        </div>
        <p className="warning">
          <strong>X goes first</strong>
        </p>
        <div className="choosing-game-type-buttons">
          <button className="blue-btn btn" onClick={() => onStart("vs-cpu")}>
            New game (vs CPU)
          </button>
          <button
            className="yellow-btn btn"
            onClick={() => onStart("vs-player")}
          >
            New game (vs PLAYER)
          </button>
        </div>
      </div>
    </div>
  );
}
function Game({
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

function FinalScreen({ winner, onRestartGame, onQuitGame }) {
  const someoneWon = winner !== null;
  return (
    <div id="final-screen">
      <div className="container">
        <h3>
          {someoneWon ? (
            <Fragment>
              <img src={"/images/" + winner + ".png"} />
              Wins
            </Fragment>
          ) : (
            "Tie"
          )}
        </h3>
        <div className="flex buttons">
          <button className="btn blue-btn" onClick={onRestartGame}>
            <span className="sr-only">Restart Game</span>
            <FontAwesomeIcon icon={icon({ name: "rotate-left" })} />
          </button>
          <button className="red-btn btn" onClick={onQuitGame}>
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}

function Board({ onClickOnSquare, board, isClickable }) {
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

function Header() {
  return (
    <header>
      <h1>Tic Tac Toe</h1>
    </header>
  );
}

function Score({ score }) {
  return (
    <div className="score-container">
      <div className="score-box-left score-box">
        <span className="little-text">X</span>
        <span className="score-number">{score.x}</span>
      </div>
      <div className="score-box score-box-middle">
        <span className="little-text">TIES</span>
        <span className="score-number">{score.ties}</span>
      </div>
      <div className="score-box-right score-box">
        <span className="little-text">O</span>
        <span className="score-number">{score.o}</span>
      </div>
    </div>
  );
}

function BoardBottom({ onRestartGame, onQuitGame, turnMark }) {
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

function Footer() {
  return (
    <footer>
      Coded by{" "}
      <a
        href="https://github.com/rafaeldevvv"
        className="special-link"
        target="_blank"
      >
        Rafael Maia
      </a>
    </footer>
  );
}

const savedScore = JSON.parse(localStorage.getItem("score")) || {
  x: 0,
  o: 0,
  ties: 0,
};
createRoot(document.querySelector("#root")).render(
  <TicTacToe initialScore={savedScore} />
);
