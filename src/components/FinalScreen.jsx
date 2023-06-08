import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro";

const {Fragment} = React;

export default function FinalScreen({ winner, onRestartGame, onQuitGame }) {
   const someoneWon = winner !== null;
   return (
     <div id="final-screen">
       <div className="container">
         <h3>
           {someoneWon ? (
             <Fragment>
               <img src={"/images/" + winner + ".png"} />
               Wins
             </Fragment>
           ) : (
             "Tie"
           )}
         </h3>
         <div className="flex buttons">
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
   );
 }