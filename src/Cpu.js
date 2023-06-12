import {
  getRandomAvailablePosition,
  checkIfMarkIsWinning,
  getRandomItem,
  calculateNextMarkToPlay,
} from "./utilities/functions.js";
import { winningSets } from "./utilities/sets.js";

class Cpu {
  #currentStrategy = null;

  constructor(strategies) {
    this.strategies = strategies.map((strategy) => [...strategy]);

    this.#currentStrategy = getRandomItem(this.strategies);
  }

  #isValidStrategy(strategy, board, mark) {
    // an array of positions with the mark placed or without any mark
    const availableOrMarkedPositions = [];
    board.forEach((pos, index) => {
      if (pos === "" || pos === mark) {
        availableOrMarkedPositions.push(String(index));
      }
    });

    // to be valid strategy, the positions above must contain
    //  some winning set positions
    // and the strategy must include it too
    return winningSets.some((ws) =>
      [...ws].every(
        (position) =>
          availableOrMarkedPositions.includes(position) &&
          strategy.includes(position)
      )
    );
  }

  #continueStrategy(board, myMark) {
    // every line of code below this filtering will have the updated valid strategies
    const validStrategies = this.strategies.filter((strategy) =>
      this.#isValidStrategy(strategy, board, myMark)
    );

    let position;

    if (validStrategies.length === 0) {
      position = getRandomAvailablePosition(board);
      board[position] = myMark;
      return;
    }

    // it will only get a strategy if there's still some valid strategy(ies) to try
    if (!this.#isValidStrategy(this.#currentStrategy, board, myMark)) {
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

  #checkIfCpuIsWinning(board, myMark) {
    const { isMarkWinning, positionToWin } = checkIfMarkIsWinning(
      board,
      myMark
    );
    return {
      isCpuWinning: isMarkWinning,
      positionForCpuToWin: positionToWin,
    };
  }

  #checkIfPlayerIsWinning(board, playerMark) {
    const { isMarkWinning, positionToWin } = checkIfMarkIsWinning(
      board,
      playerMark
    );
    return {
      isPlayerWinning: isMarkWinning,
      positionForPlayerToWin: positionToWin,
    };
  }

  #analyzeBoard(board, myMark) {
    const { isCpuWinning, positionForCpuToWin } = this.#checkIfCpuIsWinning(
      board,
      myMark
    );
    const { isPlayerWinning, positionForPlayerToWin } =
      this.#checkIfPlayerIsWinning(
        board,
        myMark === "x" ? "o" : "x" // player mark
      );

    if (isCpuWinning) {
      return {
        type: "win",
        positionToWin: positionForCpuToWin,
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

  play(board) {
    if (board.every((pos) => pos !== "")) return board;

    const nextBoard = [...board];
    const myMark = calculateNextMarkToPlay(board);
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
}

export default Cpu;
