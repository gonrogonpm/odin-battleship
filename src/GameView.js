import { Gameboard } from "./game/Gameboard";
import { Display } from "./Display";
import { ShipSelector } from "./ShipSelector";
import { Ship } from "./game/Ship";

/**
 * Defines a game view class to handle the rendering of a game state.
 */
export class GameView {
    /** @protected @type {Display} Active player display. */
    _displayPlayer;
    /** @protected @type {Display} Enemy display. */
    _displayEnemy;
    /** @protected @type {ShipSelector} Component to select the ship to place in the board. */
    _shipSelector;
    /** @protected @type {HTMLElement} Element to display messages to the user. */
    _console;
    /** @protected @type {HTMLDialogElement} Element to show the gameover dialog. */
    _gameover;

    /**
     * A callback function to be executed when the game over modal is closed.
     * @type {function(string): void | null} 
     */
    onGameOverClosed = null;

    constructor() {
        const elemDisplayPlayer = document.getElementById('display-player');
        const elemDisplayEnemy  = document.getElementById('display-enemy');
        const elemConsole       = document.getElementById('console');
        const elemGameover      = document.getElementById('gameover');
        const elemShipSelector  = document.getElementById('ship-selector');

        if (!(elemDisplayPlayer instanceof HTMLElement)) {
            throw Error('player display not found');
        }

        if (!(elemDisplayEnemy instanceof HTMLElement)) {
            throw Error('enemy display not found');
        }

        if (!(elemConsole instanceof HTMLElement)) {
            throw Error('console not found');
        }

        if (!(elemGameover instanceof HTMLDialogElement)) {
            throw Error('gameover not found');
        }

        if (!(elemShipSelector instanceof HTMLElement)) {
            throw Error('ship selector not found');
        }

        this._displayPlayer = new Display(elemDisplayPlayer);
        this._displayEnemy  = new Display(elemDisplayEnemy);
        this._shipSelector  = new ShipSelector(elemShipSelector);
        this._console       = elemConsole;
        this._gameover      = elemGameover;

        let restart = this._gameover.querySelector('#restart')
        let quit    = this._gameover.querySelector('#quit');

        if (!(restart instanceof HTMLButtonElement)) {
            throw Error('Restart button not found');
        }

        if (!(quit instanceof HTMLButtonElement)) {
            throw Error('Quit button not found');
        }

        restart.addEventListener('click', () => this.onGameOverClosed?.('restart'));
        quit   .addEventListener('click', () => this.onGameOverClosed?.('quit'));
    }

    /**
     * Sets up the inital rendering structure.
     * This should typically be called once after instantiation.
     */
    setup() {
        this._displayPlayer.setupDisplay();
        this._displayEnemy.setupDisplay();
        this._displayEnemy.hide();
        this._shipSelector.setup();
    }

    /**
     * Sets the callback function to be executed when a cell on the player's board is clicked.
     * @param {function(x: number, y:number): void | null} callback - The function to call, or null to remove.
     */
    set onPlayerCellClick(callback) {
        if (typeof callback !== 'function' && callback !== null) {
            throw TypeError('callback must be a function');
        }

        this._displayPlayer.onCellClick = callback;
    }

    /**
     * Sets the callback function to be executed when the cursor is over a cell on the player's board.
     * @param {function(x: number, y:number): void | null} callback - The function to call, or null to remove.
     */
    set onPlayerCellOver(callback) {
        if (typeof callback !== 'function' && callback !== null) {
            throw TypeError('callback must be a function');
        }

        this._displayPlayer.onCellOver = callback;
    }

    /**
     * Sets the callback function to be executed when a cell on the enemy's board is clicked.
     * @param {function(x: number, y:number): void | null} callback - The function to call, or null to remove.
     */
    set onEnemyCellClick(callback) {
        if (typeof callback !== 'function' && callback !== null) {
            throw TypeError('callback must be a function');
        }

        this._displayEnemy.onCellClick = callback;
    }

    /**
     * Sets the callback function to be executed when ship orientation is changed in the ship selector UI.
     * @param {function(orientation: number): void | null} callback - The function to call, or null to remove.
     */
    set onShipOrientationChanged(callback) {
        if (typeof callback !== 'function' && callback !== null) {
            throw TypeError('callback must be a function');
        }

        this._shipSelector.onOrientationChanged = callback;
    }

    /**
     * Sets the callback function to be executed when a ship is selected in the ship selector UI.
     * @param {function(orientation: number, type: number): void | null} callback - The function to call, or null to remove.
     */
    set onShipSelected(callback) {
        if (typeof callback !== 'function' && callback !== null) {
            throw TypeError('callback must be a function');
        }

        this._shipSelector.onShipSelected = callback;
    }

    /**
     * Shows the active player game board and hide enemy board.
     */
    showPlayer() {
        this._displayPlayer.show();
        this._displayEnemy.hide();
    }

    /**
     * Shows the enemy game board and hide active player board.
     */
    showEnemy() {
        this._displayPlayer.hide();
        this._displayEnemy.show();
    }

    /**
     * Updates the display state of active player board.
     * @param {Gameboard | null} player A gameboard instance representing the player's board or null to not update.
     */
    updatePlayerDisplay(player) {
        this.updateDisplays(player, null);
    }

    /**
     * Updates the display state of the enemy board.
     * @param {Gameboard | null} enemy A gameboard instance representing the enemy's board or null to no update.
     */
    updateEnemyDisplay(enemy) {
        this.updateDisplays(null, enemy);
    }

    /**
     * Updates the display state of active player board and the enemy board.
     * @param {Gameboard | null} player A gameboard instance representing the player's board or null to not update.
     * @param {Gameboard | null} enemy A gameboard instance representing the enemy's board or null to no update.
     */
    updateDisplays(player, enemy) {
        if (player !== null) { this._displayPlayer.setPlayerWaters(player); }
        if (enemy  !== null) { this._displayEnemy.setEnemyWaters(enemy); }
    }

    /**
     * Highlights the cell where a ship will be placed.
     * 
     * @param {number} orientation - The orientation of the ship (use a value from the Orientation enum).
     * @param {number} type - The type of the ship (use a value from the ShipType enum).
     * @param {number} x - The starting x-coordinate of the ship (top-leftmost part).
     * @param {number} y - The starting y-coordinate of the ship (top-leftmost part).
     */
    highlightShipPlacementTry(orientation, type, x, y) {
        this._displayPlayer.clearHighlight();
        this._displayPlayer.highlight(orientation, x, y, Ship.getShipTypeLength(type));
    }

    /**
     * Clears the cells highlighted by the last ship placement try.
     */
    clearShipPlacementTry() {
        this._displayPlayer.clearHighlight();
    }

    /**
     * Marks a ship in the ship selector as placed.
     * @param {number} type - The type of the ship (use a value from the ShipType enum).
     */
    setShipAsPlaced(type) {
        this.clearShipPlacementTry();
        this._shipSelector.setAsPlaced(type);
    }

    /**
     * Shows the ship selector.
     */
    showShipSelector() {
        this._shipSelector.show();
    }

    /**
     * Hides the ship selector.
     */
    hideShipSelector() {
        this._shipSelector.hide();
    }

    setConsoleMessage(msg) {
        this._console.innerHTML = msg;
    }

    showGameover(msg) {
        this._gameover.querySelector('p').textContent = msg;
        this._gameover.showModal();
    }

    hideGameover() {
        this._gameover.close();
    }
}