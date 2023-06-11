import { winningSetsLineStyles } from "./sets";

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
