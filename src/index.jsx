// general
import { createRoot } from "react-dom/client";

// utilities
import {
  getWinner,
  calculateNextMarkToPlay,
  countMarks,
} from "./utilities/functions.js";

// components
import Footer from "./components/Footer.jsx";
import Game from "./components/Game.jsx";
import FinalScreen from "./components/FinalScreen.jsx";
import InitialScreen from "./components/InitialScreen.jsx";

// Cpu
import Cpu from "./Cpu.js";
import { strategies } from "./utilities/sets.js";
const cpu = new Cpu(strategies);

const { useState } = React;

function TicTacToe({ initialScore }) {
  const [chosenMark, setChosenMark] = useState("x");
  const [status, setStatus] = useState("choosing");
  const [score, setScore] = useState(initialScore);
  const [mode, setMode] = useState(null);

  const [board, setBoard] = useState(new Array(9).fill(""));

  function handleClickOnSquare(position) {
    if (board[position] !== "") {
      return;
    }

    let nextBoard = [...board];

    if (mode === "vs-cpu") {
      nextBoard[position] = chosenMark;
    } else {
      const nextMarkToPlay = calculateNextMarkToPlay(board);
      nextBoard[position] = nextMarkToPlay;
    }

    let winner = null;
    let numberOfMarksInGame = countMarks(nextBoard);

    if (numberOfMarksInGame >= 5) {
      winner = getWinner(nextBoard);
    }

    if (mode === "vs-cpu" && !winner) {
      nextBoard = cpu.play(nextBoard);
      numberOfMarksInGame = countMarks(nextBoard);
      if (numberOfMarksInGame >= 5) winner = getWinner(nextBoard);
    }

    setBoard(nextBoard);

    // if someone won or there's a tie
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
    setStatus("finished");
    updateScore(winner || "ties");
  }

  function handleStart(mode) {
    setStatus("playing");
    setMode(mode);
    if (mode === "vs-cpu" && chosenMark === "o") {
      const firstBoard = cpu.play(board);
      setBoard(firstBoard);
    }
  }

  function handleRestartGame() {
    let nextBoard = new Array(9).fill("");
    if (mode === "vs-cpu" && chosenMark === "o") {
      nextBoard = cpu.play(nextBoard);
    }

    setStatus("playing");
    setBoard(nextBoard);
  }

  function handleQuitGame() {
    setStatus("choosing");
    setBoard(new Array(9).fill(""));
    setMode(null);
  }

  const winner = getWinner(board);

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
                onChooseMark={setChosenMark}
                chosenMark={chosenMark}
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
