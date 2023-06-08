import { getRandomItem } from "./utilities/functions.js";
import {
  getRandomAvailablePosition,
  isMarkWinning,
  isValidStrategy,
} from "./cpu-utilities.js";

class Cpu {
  #currentStrategy = null;

  constructor(strategies) {
    this.strategies = strategies.map((strategy) => [...strategy]);

    this.#currentStrategy = getRandomItem(this.strategies);
  }

  #continueStrategy(board, myMark) {
    // every line of code below this filtering will have the updated valid strategies
    const validStrategies = this.strategies.filter((strategy) =>
      isValidStrategy(strategy, board, myMark)
    );

    let position;

    if (validStrategies.length === 0) {
      position = getRandomAvailablePosition(board);
      board[position] = myMark;
      return;
    }

    // it will only get a strategy if there's still some valid strategy(ies) to try
    if (!isValidStrategy(this.#currentStrategy, board, myMark)) {
      this.#currentStrategy = getRandomItem(validStrategies);
    }

    // this loop will always break because if it comes here then there's valid
    // strategy(ies) so there's an available position
    for (;;) {
      position = getRandomItem(this.#currentStrategy);

      if (board[position] !== "") continue;
      else break;
    }

    board[position] = myMark;
  }

  #iAmWinning(board, myMark) {
    const { isMarkInGameWinning, positionToWin } = isMarkWinning(board, myMark);
    return {
      iAmWinning: isMarkInGameWinning,
      positionForMeToWin: positionToWin,
    };
  }

  #isPlayerWinning(board, playerMark) {
    const { isMarkInGameWinning, positionToWin } = isMarkWinning(
      board,
      playerMark
    );
    return {
      isPlayerWinning: isMarkInGameWinning,
      positionForPlayerToWin: positionToWin,
    };
  }

  #analyzeBoard(board, myMark) {
    const { iAmWinning, positionForMeToWin } = this.#iAmWinning(board, myMark);
    const { isPlayerWinning, positionForPlayerToWin } = this.#isPlayerWinning(
      board,
      myMark === "x" ? "o" : "x"
    );

    if (iAmWinning) {
      return {
        type: "win",
        positionToWin: positionForMeToWin,
      };
    } else if (isPlayerWinning) {
      return {
        type: "stop_player",
        positionToStopPlayer: positionForPlayerToWin,
      };
    } else {
      return {
        type: "continue_strategy",
      };
    }
  }

  play(board, myMark) {
    if (board.every((pos) => pos !== "")) return board;

    const nextBoard = [...board];
    const action = this.#analyzeBoard(nextBoard, myMark);

    console.log(action.type);
    switch (action.type) {
      case "win": {
        nextBoard[action.positionToWin] = myMark;
        break;
      }
      case "stop_player": {
        nextBoard[action.positionToStopPlayer] = myMark;
        break;
      }
      case "continue_strategy": {
        this.#continueStrategy(nextBoard, myMark);
        break;
      }
      default: {
        throw new Error("Unknown action type: " + action.type);
      }
    }

    return nextBoard;
  }
}

export default Cpu;
