// general
import { createRoot } from "react-dom/client";

// utilities
import {
  getWinner,
  calculateNextMarkToPlay,
  countMarks,
} from "./utilities/functions.js";
import { strategies } from "./utilities/sets.js";
import Cpu from "./Cpu.js";

// components
import Footer from "./components/Footer.jsx";
import Game from "./components/Game.jsx";
import FinalScreen from "./components/FinalScreen.jsx";
import InitialScreen from "./components/InitialScreen.jsx";

const { useState } = React;

const cpu = new Cpu(strategies);

function TicTacToe({ initialScore }) {
  const [chosenSymbol, setChosenSymbol] = useState("x");
  const [status, setStatus] = useState("choosing");
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState(initialScore);
  const [mode, setMode] = useState(null);

  const [board, setBoard] = useState(new Array(9).fill(""));

  function handleClickOnSquare(index) {
    let nextBoard = [...board];
    if (nextBoard[index] !== "") {
      return;
    }

    if (mode === "vs-cpu") {
      nextBoard[index] = chosenSymbol;
    } else {
      const nextMarkToPlay = calculateNextMarkToPlay(board);
      nextBoard[index] = nextMarkToPlay;
    }

    let winner = getWinner(nextBoard);

    if (mode === "vs-cpu" && winner === null) {
      const cpuMark = chosenSymbol === "x" ? "o" : "x";
      nextBoard = cpu.play(nextBoard, cpuMark);
    }

    setBoard(nextBoard);

    winner = getWinner(nextBoard);
    const numberOfMarksInGame = countMarks(nextBoard);

    if (!!winner || numberOfMarksInGame === 9) {
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
      const firstBoard = cpu.play(board, "x");
      setBoard(firstBoard);
    }
  }

  function handleRestartGame() {
    if (status !== "playing") setStatus("playing");

    let nextBoard = new Array(9).fill("");
    if (mode === "vs-cpu" && chosenSymbol === "o") {
      nextBoard = cpu.play(board, "x");
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
      <header>
        <h1>Tic Tac Toe</h1>
      </header>
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

const savedScore = JSON.parse(localStorage.getItem("score")) || {
  x: 0,
  o: 0,
  ties: 0,
};
createRoot(document.querySelector("#root")).render(
  <TicTacToe initialScore={savedScore} />
);
