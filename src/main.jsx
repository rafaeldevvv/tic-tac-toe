// general
import { createRoot } from "react-dom/client";

// utilities
import {
  getWinner,
  calculateNextMarkToPlay,
  countMarks,
  getWinningSet,
} from "./utilities/functions.js";
import { resetLineStyles } from "./utilities/sets.js";
import { animateLine } from "./utilities/animations.js";

// components
import Footer from "./components/Footer.jsx";
import Game, { Board } from "./components/Game.jsx";
import FinalScreen from "./components/FinalScreen.jsx";
import InitialScreen from "./components/InitialScreen.jsx";

// Cpu
import Cpu from "./Cpu.js";
import { strategies } from "./utilities/sets.js";
const cpu = new Cpu(strategies);

const { useState, useRef } = React;

function TicTacToe({ initialScore }) {
  const [chosenMark, setChosenMark] = useState("x");
  const [status, setStatus] = useState("choosing");
  const [score, setScore] = useState(initialScore);
  const [mode, setMode] = useState(null);
  const [board, setBoard] = useState(new Array(9).fill(""));

  const lineRef = useRef(null);

  function handleClickOnSquare(position) {
    // winner is declared here because if the player clicks the board while the
    // line is being animated(that is, someone won) then we would get an inconsistency
    let winner = getWinner(board);

    if (board[position] !== "" || status === "finished" || winner !== null) {
      return;
    }

    let nextBoard = [...board];

    if (mode === "vs-cpu") {
      nextBoard[position] = chosenMark;
    } else {
      const nextMarkToPlay = calculateNextMarkToPlay(board);
      nextBoard[position] = nextMarkToPlay;
    }

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
      handleEndGame(winner, nextBoard);
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

  function handleEndGame(winner, lastBoard) {
    if (winner) {
      const winningSet = getWinningSet(lastBoard, winner);
      animateLine(lineRef.current, winningSet, () => {
        setStatus("finished");
        updateScore(winner);
      });
    } else {
      setStatus("finished");
      updateScore("ties");
    }
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

    Object.assign(lineRef.current.style, resetLineStyles);
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
                onRestartGame={handleRestartGame}
                onQuitGame={handleQuitGame}
                turnMark={calculateNextMarkToPlay(board)}
              >
                <div className="board-wrapper">
                  <div className="line" ref={lineRef}></div>
                  <Board board={board} onClickOnSquare={handleClickOnSquare} />
                </div>
              </Game>
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
