import { GameController } from "./GameController.js";
import { PlayerHuman } from "./game/PlayerHuman.js";
import { PlayerComputerDummy } from "./game/PlayerComputerDummy.js"
import { Gameboard } from "./game/Gameboard.js";
import { Orientation } from "./game/Orientation.js";
import { ShipType } from "./game/ShipType.js";
import { GameView } from "./GameView.js";
import * as Messages from "./Messages.js";

export class GameControllerSolo extends GameController {
    _playerHuman;
    _playerHumanGameboard;
    _playerComputer;
    _playerComputerGameboard;
    _view;

    constructor() {
        super();
        this._playerHumanGameboard    = new Gameboard();
        this._playerHuman             = new PlayerHuman(this._playerHumanGameboard);
        this._playerComputerGameboard = new Gameboard();
        this._playerComputer          = new PlayerComputerDummy(this._playerComputerGameboard);
        this._view = new GameView();
    }

    setup() {
        this.runPlayerPlacement();
        this.runComputerPlacement();
        this._view.setup();
        this._view.updateDisplays(this._playerHumanGameboard, this._playerComputerGameboard);
        this._view.showPlayer();
    }

    async start() {
        //await this.runInitialSequence();
        await this.runHumanTurn();
    }

    async runInitialSequence() {
        this._view.setConsoleMessage(Messages.MSG_FLEETREADY);
        await this.#addWaiting(2);
        this._view.setConsoleMessage(Messages.MSG_SEARCHING);
        await this.#addWaiting(2);
        this._view.setConsoleMessage(Messages.MSG_DETECTED);
        await this.#addWaiting(2);
    }

    async runHumanTurn() {
        this._view.onEnemyCellClick = (x, y) => this.handleEnemyCellClick(x, y);
        this._view.showEnemy();
        this._view.setConsoleMessage(Messages.MSG_WAITING);
    }

    async runHumanShot(x, y) {
        this._view.setConsoleMessage(Messages.replace(Messages.MSG_AIMING, x, y));
        await this.#addWaiting(1);
        this._view.setConsoleMessage(Messages.MSG_FIRE);
        await this.#addWaiting(1);
        // Performs the attack and update the screen.
        const result = this._playerComputer.receiveAttack(x, y);
        this.#sinkAll(this._playerComputerGameboard);
        this._view.updateEnemyDisplay(this._playerComputerGameboard);
        // Show a message to confirm hit or miss.
        if (result.ship >= 0) {
            this._view.setConsoleMessage(Messages.MSG_HIT);
        }
        else {
            this._view.setConsoleMessage(Messages.MSG_MISS);
        }
        // Check if the human wins.
        if (this._playerComputer.isAllSunk()) {
            setTimeout(() => this.runHumanWin())
        }
        else {
            // Wait to let user view the result and start the computer turn.
            setTimeout(() => this.runComputerTurn(), 2000);
        }
    }

    async runComputerTurn() {
        this._view.showPlayer();
        this._view.setConsoleMessage(Messages.MSG_ENEMYFIRE);
        await this.#addWaiting(1);
        // Performs the attack and update the screen.
        const [x, y] = this._playerComputer.aim(this._playerHuman);
        const result = this._playerHuman.receiveAttack(x, y);
        console.log(`Attack player at: ${x}, ${y}`);
        this._view.updatePlayerDisplay(this._playerHumanGameboard);
        // Show a message to confirm hit or miss.
        if (result.ship >= 0) {
            if (result.sunk) {
                this._view.setConsoleMessage(Messages.replace(Messages.MSG_SUNK, ShipType.toString(result.ship)));
            }
            else {
                this._view.setConsoleMessage(Messages.replace(Messages.MSG_HITFRIEND, ShipType.toString(result.ship)));
            }
        }
        else {
            this._view.setConsoleMessage(Messages.MSG_MISS);
        }
        // Check if the computer wins.
        if (this._playerHuman.isAllSunk()) {
            setTimeout(() => this.runComputerWin())
        }
        else {
            // Wait to let user view the result and start the human turn.
            setTimeout(() => this.runHumanTurn(), 2000);
        }
    }

    async runHumanWin() {
        this._view.showGameover('You win!');
    }

    async runComputerWin() {

    }

    handlePlayerCellClick() {

    }

    handleEnemyCellClick(x, y) {
        this._view.onEnemyCellClick = null;
        this.runHumanShot(x, y);
    }

    runPlayerPlacement() {
        // Open ship placement interface.
        // Wait the user to place the ships.
        // Open the human player interface.
        /* Test board */
        this._playerHumanGameboard.placeShip(0, 0, Orientation.HORIZONTAL, ShipType.CARRIER);
        this._playerHumanGameboard.placeShip(3, 3, Orientation.HORIZONTAL, ShipType.SUBMARINE);
        this._playerHumanGameboard.placeShip(1, 2, Orientation.VERTICAL, ShipType.BATTLESHIP);
        this._playerHumanGameboard.placeShip(7, 9, Orientation.HORIZONTAL, ShipType.DESTROYER);
        this._playerHumanGameboard.placeShip(8, 5, Orientation.VERTICAL, ShipType.PATROLBOAT);
    }

    runComputerPlacement() {
        this._playerComputer.placeShips();
    }

    #addWaiting(seconds) {
        return new Promise(function (resolve) {
            setTimeout(() => resolve(), seconds * 1000);
        });
    }

    /*******************/
    /* DEBUG FUNCTIONS */
    /*******************/

    /**
     * Sinks all ships in a game board.
     * @param {Gameboard} targetBoard
     */
    #sinkAll(targetBoard) {
        for (let y = 0; y < targetBoard.height; y++) {
            for (let x = 0; x < targetBoard.width; x++) {
                if (!targetBoard.isWater(x, y) && !targetBoard.isAttacked(x, y)) {
                    targetBoard.receiveAttack(x, y);
                }
            }
        }
    }
}