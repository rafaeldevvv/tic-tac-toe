export default function InitialScreen({
  onStart,
  onChooseSymbol,
  chosenSymbol,
}) {
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
