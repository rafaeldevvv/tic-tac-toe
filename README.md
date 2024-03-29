# Tic-Tac-Toe

This is an implementation of a Tic Tac Toe Game.

## Table of Contents

- [Overview](#overview)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Features](#features)
  - [Beginning](#beginning)
  - [State Implementation](#state-implementation)
  - [Handlers](#handlers)
  - [CPU Implementation](#cpu-implementation)
  - [Line Animation](#line-animation)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [License](#license)

## Overview

### File Organization

- dist
- images
  - o.png
  - x.png
- src
  - components
    - FinalScreen
    - Footer
    - Game
    - InitialScreen
  - utilities
    - functions.js
    - sets.js
    - animations.js
  - Cpu.js
  - main.jsx
- style
  - index.scss
  - reset.css
  - utilities.css
- tests
  ...

### Screenshots

![](./screenshot1.png)
![](./screenshot2.png)

### Links

- [Code](https://github.com/rafaeldevvv/tic-tac-toe)
- [Live Site URL](https://rafaeldevvv.github.io/tic-tac-toe/)

## My Process

### Built With

- CSS FlexBox
- HTML
- JavaScript
- React
- Grid Layout
- Webpack
- CSS
- SCSS/SASS
- JSX
- Photoshop (for the marks)

### Features

- Two-player game
- Basic AI for CPU player
- Score
- Different Game modes(vs-cpu or vs-player)
- Option to choose a specific mark
- Buttons to restart or quit the game

---

### Beginning

Starting this project, I already had an idea of what I would do because some time ago I had made a tic tac toe game - when I didn't know how to code.

The easiest part was to build the UI. After that I had to implement the function to get the winner - which was also fairly easy to make. I simply check if any of the winning sets has its positions placed by the specified mark.

```js
export function getWinner(board) {
  function markWins(symbol) {
    // this is the array of the positions that the symbol takes up in the board
    const indexes = [];
    board.forEach((position, index) => {
      if (position === symbol) {
        indexes.push(String(index));
      }
    });

    // this maps the winningSets array to
    // an array of booleans which say if the
    // symbol is found on the specific positions of a winning set
    const booleans = winningSets.map((winningSet) => {
      const positions = [...winningSet];
      return positions.every((position) => indexes.indexOf(position) >= 0);
    });

    // if the positions of a winning set are found in the positions of a symbol,
    // then it returns true saying that the symbols wins the game.
    return booleans.some((boolean) => boolean === true);
  }

  if (markWins("x")) return "x";
  else if (markWins("o")) return "o";
  else return null;
}
```

By the way, I used an array of winning sets - which are the winning positions - to determine the winner instead of a function that somehow calculates three subsequent positions horizontally, vertically and diagonally. I think this is okay for a tic tac toe game.

The winningSets array is inside the sets file, together with the strategies array - this is for the cpu. The strategies array include some strategies that I used to use to always win the game and also the winningSets themselves.

```js
export const winningSets = [
  "012",
  "345",
  "678",
  "048",
  "246",
  "036",
  "147",
  "258",
];

export const strategies = [
  ...winningSets,
  "042368",
  "014286",
  "248065",
  "684720",
  "012458",
  "012346",
  "678340",
  "678452",
];
```

---

### State Implementation

I imagined the game as having three states: choosing(game mode and mark), playing(actually placing the marks) and finished(the game has ended - someone has one or there's a tie). For each of these states, there's a specific component.

I didn't use the useState Hook for the winner because I can always calculate it from the current board. Beside the getWinner function is pure because it does not change any preexisting variable and it always returns the same winner for the same board.

```jsx
function TicTacToe({ initialScore }) {
  const [chosenMark, setChosenMark] = useState("x");
  const [status, setStatus] = useState("choosing");
  const [score, setScore] = useState(initialScore);
  const [mode, setMode] = useState(null);

  const [board, setBoard] = useState(new Array(9).fill(""));

  // ...
}
```

You might also think that I didn't need to manage all the state in the `TicTacToe` component. Let's go through each piece of state:

`chosenSymbol` - I need to use this to handle some actions like click on square, `handleStart` and so on. These functions affect the board which I need on the `TicTacToe` component to calculate the winner.

`status` - It coordinated which screen to display, and so it cannot be inside any of the screens.

`score`- It is updated when the game ends by the `handleClickOnSquare` function. If it were in the `Score` or `Game` component, these components would have to somehow expose methods to the parent component in order to update the score, but that is not possible.

`mode` - Well, same thing as the `chosenMark`.

`board`- I need it to calculate the winner which is used by the `FinalScreen` component. If it were inside the `Game` component it wouldn't be possible to pass the winner to the `FinalScreen` component.

So, I think it is necessary to have those state variables in the top level component.

---

### Handlers

The most important handler first checks whether the clicked position is empty so that it can be marked. If so, then the board is copied and the corresponding marked is placed. There is only possible to be a winner after at least five marks are placed, so we get the winner only if there's five or more marks placed.

```js
function handleClickOnSquare(index) {
  if (board[index] !== "") {
    return;
  }

  let nextBoard = [...board];

  if (mode === "vs-cpu") {
    nextBoard[index] = chosenMark;
  } else {
    const nextMarkToPlay = calculateNextMarkToPlay(board);
    nextBoard[index] = nextMarkToPlay;
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
```

It is not possible to decrease the score to there's this helper function:

```js
function updateScore(category) {
  const nextScore = { ...score };
  if (!!category) {
    nextScore[category]++;
  }

  setScore(nextScore);
  localStorage.setItem("score", JSON.stringify(nextScore));
}
```

These functions check if the mode is "vs-cpu" and the chosenMark is "o", so that the cpu can place a mark first.

```js
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
```

---

### CPU Implementation

Having the system to get the winner, I had to now implement the CPU - I didn't want to have the player play against a system that places marks in random positions. This implementation was quite complex and I had to think a lot. I even wrote down my thoughts - I don't do it often, but it helps, so I am going to start doing it more frequently - to facilitate this implementation.

This was the first time I used private fields in a class to encapsulate it.

My idea for the cpu was that it had to prioritize certain actions, that is, if it is winning then it does not need to prevent the player from winning and so on. So I implemented a private method called analyzeBoard that returns an action object - yeah, I got some inspiration from the reducer approach to managing state.

```js
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
```

This method uses two other private methods: `#isPlayerWinning` and `#iAmWinning` - which, you can guess by the name, check if the player is winning and if the cpu itself is winning. They also return the position to win the game, which is necessary to stop the player or win the game. Both of them use the `isMarkWinning` function which verifies that a mark is winning, and, if the mark is winning, it returns the positions for the mark to win.

This function was the most challenging one to make, I made a lot of mistakes, but finally, I managed to do it. The mark is winning if two out of three positions of a winning set have the mark placed. This is the implementation:

```js
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
  // there can be more than one almost won set depending on the strategy
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
```

After analyzing the board, the cpu would take the proper action.

```js
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
```

Now the #continueStrategy method took me a lot of thinking to make. I tried a lot of approaches and the last one was the simplest I found.

The idea is to implement a strategy and continue implementing it until it is not valid any more. For that I had to implement a `isValidStrategy` function to check if a certain strategy is valid for a given mark and board state.

A strategy is valid if at least one of the winning sets has its positions both in the board(empty or marked by the specified mark) and in the strategy.

```js
export function isValidStrategy(board, strategy, playingMark) {
  // an array of positions with the mark placed or without any mark
  const availableOrMarkedPositions = [];
  board.forEach((pos, index) => {
    if (pos === "" || pos === playingMark) {
      availableOrMarkedPositions.push(String(index));
    }
  });

  // if some winning set has all its positions in both the board and in the strategy
  return winningSets.some((ws) =>
    [...ws].every(
      (position) =>
        availableOrMarkedPositions.includes(position) &&
        strategy.includes(position)
    )
  );
}
```

The `#continueStrategy` method first filters the strategies by validity, if there's no valid strategy then it just takes a random available position in the board. If there's still valid strategies but the current strategy is not valid, we change it for a valid one. Now we take a random position in the currentStrategy that is empty in the board.

```js
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
```

### Line Animation

I hardcoded the styles for the line of each winning set:

```js
export const winningSetsLineStyles = {
  "012": {
    top: "16.5%",
    left: "0%",
    transform: "translateY(-50%)",
  },
  345: {
    top: "50%",
    left: "0%",
    transform: "translateY(-50%)",
  },
  678: {
    top: "83.5%",
    left: "0%",
    transform: "translateY(-50%)",
  },
  "048": {
    top: "9%",
    left: "15%",
    transformOrigin: "top left",
    transform: "rotate(45deg)",
  },
  246: {
    top: "82%",
    left: "17.5%",
    transformOrigin: "bottom left",
    transform: "rotate(-45deg)",
  },
  "036": {
    top: "0",
    left: "18.5%",
    transformOrigin: "top left",
    transform: "rotate(90deg)",
  },
  147: {
    top: "0",
    left: "53%",
    transformOrigin: "top left",
    transform: "rotate(90deg)",
  },
  258: {
    top: "0",
    left: "87%",
    transformOrigin: "top left",
    transform: "rotate(90deg)",
  },
};
```

There was no way to override the styles of an element affected by an animation with the fill option set to "forwards", so I had to find a way. The `animateLine` function forces the width of the line to be 100% at the end of the animation, and the `handleRestartGame` function sets it back to 0%:

```js
export function animateLine(lineDOM, winningSet, callback) {
  const lineStyle = winningSetsLineStyles[winningSet];
  Object.assign(lineDOM.style, lineStyle);
  const animation = lineDOM.animate(
    [
      {
        width: "0%",
      },
      {
        width: "100%",
      },
    ],
    {
      duration: 1000,
    }
  );
  animation.onfinish = function () {
    callback();
    lineDOM.style.width = "100%";
  };
}
```

```js
function handleRestartGame() {
  let nextBoard = new Array(9).fill("");
  if (mode === "vs-cpu" && chosenMark === "o") {
    nextBoard = cpu.play(nextBoard);
  }

  Object.assign(lineRef.current.style, resetLineStyles);
  setStatus("playing");
  setBoard(nextBoard);
}
```

And here I applied the Single Responsibility Principle. I had put the animation all inside the `handleEndGame` function but then I thought: "The responsibility of this function is to end the game, it should not be concerned about how the line is animated". So I moved the animation to the `animateLine` function just passing a callback that will be called when the animation ends. So now any change concerning the animation of the line does not require changes in the `handleEndGame` function.

_Note_: I just highlighted the implementation of the Single Responsibility Principle because it was the first time that I really thought about it.

```js
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
```

Also, I didn't want to use the `forwardRef` function, so I did this:

```js
<Game
  score={score}
  board={board}
  onClickOnSquare={handleClickOnSquare}
  onRestartGame={handleRestartGame}
  onQuitGame={handleQuitGame}
  turnMark={calculateNextMarkToPlay(board)}
>
  <div className="board-wrapper">
    <div className="line" ref={lineRef}></div>
    <Board board={board} onClickOnSquare={handleClickOnSquare} />
  </div>
</Game>
```

```jsx
export default function Game({
  score,
  onRestartGame,
  onQuitGame,
  turnMark,
  children,
}) {
  return (
    <div id="game">
      <Score score={score} />
      {children} // children is the board and its wrapper
      <BoardBottom
        onRestartGame={onRestartGame}
        onQuitGame={onQuitGame}
        turnMark={turnMark}
      />
    </div>
  );
}
```

### Useful resources

- [chatGPT](https://chat.openai.com/) - It helped a lot

## Author

- Instagram - [@rafaeldevvv](https://www.instagram.com/rafaeldevvv)
- Twitter - [@rafaeldevvv](https://www.twitter.com/rafaeldevvv)
- YouTube - [@rafaelmaia4836](https://www.youtube.com/channel/UC_QOvDZdUskTSJ59eMDjuEg)

## License

MIT License

Copyright (c) 2023 Rafael Maia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
