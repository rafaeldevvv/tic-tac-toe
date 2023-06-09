export default function InitialScreen({
  onStart,
  onChooseMark,
  chosenMark,
}) {
  return (
    <div id="initial-screen">
      <div className="container">
        <h3>Pick a Mark</h3>
        <div className="choices">
          <button
            className={"choice " + (chosenMark === "x" ? "selected" : "")}
            onClick={() => onChooseMark("x")}
          >
            X
          </button>
          <button
            className={"choice " + (chosenMark === "o" ? "selected" : "")}
            onClick={() => onChooseMark("o")}
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
