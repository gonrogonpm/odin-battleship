import style from "./style.css";
import { GameView } from "./GameView.js";
import { Gameboard } from "./game/Gameboard.js";
import { Orientation } from "./game/Orientation.js";
import { ShipType } from "./game/ShipType.js";
import { GameControllerSolo } from "./GameControllerSolo.js";
(function setup() {
    const ctrl = new GameControllerSolo();
    ctrl.setup();
    ctrl.start();
    
    //view.updateDisplays(gameboardPlayer, gameboardPlayer);
    //view.showPlayer();
    //view.showEnemy();
    /*
    boardLHSDisplay.setPlayerWaters(gameboardPlayer);
    boardRHSDisplay.setEnemyWaters(gameboardPlayer);

    boardLHSDisplay.onCellClick = (x, y) => {
        console.log(`click detected at cell (${x}, ${y})`);
    }
    */
})();