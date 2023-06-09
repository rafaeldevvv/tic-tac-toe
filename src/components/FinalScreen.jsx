import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

const { Fragment, useState } = React;

export default function FinalScreen({ winner, onRestartGame, onQuitGame }) {
  const [isVisible, setIsVisible] = useState(true);

  const someoneWon = winner !== null;
  return (
    isVisible && (
      <div id="final-screen">
        <div className="container">
          <div></div>
          <h3>
            {someoneWon ? (
              <Fragment>
                <img src={"./images/" + winner + ".png"} alt={winner} />
                Wins
              </Fragment>
            ) : (
              "Tie"
            )}
          </h3>
          <div className="flex buttons">
            <button
              className="see-board-button btn yellow-btn"
              onClick={() => {
                setIsVisible(false);
              }}
            >
              See board
            </button>
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
    )
  );
}
