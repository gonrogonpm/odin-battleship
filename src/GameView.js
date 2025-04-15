import { Gameboard } from "./game/Gameboard";
import { Display } from "./Display";

/**
 * Defines a game view class to handle the rendering of a game state.
 */
export class GameView {
    /** @protected @type {Display} Active player display. */
    _displayPlayer;
    /** @protected @type {Display} Enemy display. */
    _displayEnemy;
    /** @protected @type {HTMLElement} Element to display messages to the user. */
    _console;
    /** @protected @type {HTMLDialogElement} Element to show the gameover dialog. */
    _gameover;

    constructor() {
        const elemDisplayPlayer = document.getElementById('display-player');
        const elemDisplayEnemy  = document.getElementById('display-enemy');
        const elemConsole       = document.getElementById('console');
        const elemGameover      = document.getElementById('gameover');

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

        this._displayPlayer = new Display(elemDisplayPlayer);
        this._displayEnemy  = new Display(elemDisplayEnemy);
        this._console       = elemConsole;
        this._gameover      = elemGameover;
    }

    /**
     * Sets up the inital rendering structure.
     * This should typically be called once after instantiation.
     */
    setup() {
        this._displayPlayer.setupDisplay();
        this._displayEnemy.setupDisplay();
        this._displayEnemy.hide();
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

    setConsoleMessage(msg) {
        this._console.textContent = msg;
    }

    showGameover(msg) {
        this._gameover.querySelector('p').textContent = msg;
        this._gameover.showModal();
    }

    hideGameover() {
        this._gameover.close();
    }
}