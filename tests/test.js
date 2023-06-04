import { getRandomItem } from "./utilities.js";
import {
  getRandomAvailablePosition,
  isMarkWinning,
  isValidStrategy,
} from "./cpu-utilities.js";

class Cpu {
  #currentStrategy = null;
  #originalStrategies = null;

  constructor(strategies) {
    this.strategies = strategies.map((strategy) => strategy.split(","));

    this.#originalStrategies = this.strategies; // to restart the cpu when the game ends

    this.#currentStrategy = getRandomItem(this.strategies);
  }

  #removePositionFromStrategies(pos) {
    this.#currentStrategy = this.#currentStrategy.filter(
      (position) => pos !== position
    );
    this.strategies = this.strategies.map((strategy) =>
      strategy.filter((position) => pos !== position)
    );
  }

  #filterPositions(board) {
    board.forEach((position, index) => {
      if (position !== "") {
        this.#removePositionFromStrategies(String(index));
      }
    });
  }

  #filterStrategies(board, myMark) {
    this.strategies = this.strategies.filter((strategy) =>
      isValidStrategy(board, strategy, myMark)
    );
  }

  #continueStrategy(board, myMark) {
    this.#filterPositions(board);
    this.#filterStrategies(board, myMark);

    let position;

    if (this.strategies.length === 0) {
      position = getRandomAvailablePosition(board);
      board[position] = myMark;
      return;
    }

    if (!isValidStrategy(board, this.#currentStrategy, myMark)) {
      this.#currentStrategy = getRandomItem(this.strategies);
    }

    position = getRandomItem(this.#currentStrategy);

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
    const nextBoard = [...board];
    const action = this.#analyzeBoard(nextBoard, myMark);

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

  restart() {
    this.strategies = this.#originalStrategies;
  }
}

export default Cpu;
