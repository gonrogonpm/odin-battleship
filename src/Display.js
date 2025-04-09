import { GameboardWidth, GameboardHeight, Gameboard } from "./game/Gameboard.js";
import { Orientation } from "./game/Orientation.js";
import { ShipType } from "./game/ShipType.js";
import { Ship } from "./game/Ship.js";

/**
 * Defines a display class to handle the rendering of a gameboard onto the DOM and captures the user interaction.
 */
export class Display {
    /** @private @type {HTMLElement} The main container for this display. */
    #display;

    /** @private @type {HTMLElement} The element to display the title. */
    #title;

    /** @private @type {HTMLElement} The element that contains the grid cells. */
    #board;

    /** @private @type {HTMLElement[]} 1D array holding references to the individual cell for quick access based on calculated index. */
    #cells;

    /**
     * A callback function to be executed when a valid cell is clicked.
     * The function will receive the x and y coordinates of the clicked cell. 
     * @type {function(x: number, y: number): void | null} 
     */
    onCellClick = null;

    /**
     * Creates an instance of the display.
     * Finds necessary child elements within the provided root element.
     * @param {HTMLElement} root - The root container element.
     * @throws {TypeError} If 'root' is not a valid element.
     * @throws {Error} If 'title' or 'board' child elements are not found within 'root'.
     */
    constructor(root) {
        if (!root || !(root instanceof HTMLElement)) {
            throw TypeError('root must be a HTML element');
        }

        this.#display = root;
        this.#title   = root.querySelector('.title');
        this.#board   = root.querySelector('.board');

        if (!this.#title) {
            throw Error('title element not found');
        }

        if (!this.#board) {
            throw Error('board element not found');
        }
    }

    /**
     * Sets up the initial display structure.
     * Creates the grid cells within the board element and registers event listeners.
     * This should typically be called once after instantiation.
     */
    setupDisplay() {
        this.#cells = new Array(GameboardWidth * GameboardHeight);
        // Create the grid and register the cell for future access.
        this.#board.append(Display.#createGrid(null, (x, y, cell) => {
            this.#cells[this.#getCellIndex(x, y)] = cell;
        }));

        this.#board.addEventListener('click', event => this.#handleCellClick(event));
    }

    /**
     * Renders the player's own game board state.
     * Shows placed ships, hits on those ships, and misses (shots on water).
     * @param {Gameboard} gameboard - The gameboard instance representing the player's board.
     */
    setPlayerWaters(gameboard) {
        this.clearWaters();

        for (let type = ShipType.CARRIER; type <= ShipType.PATROLBOAT; type++) {
            this.setPlayerShip(gameboard, type);
        }

        for (let y = 0; y < gameboard.height; y++) {
            for (let x = 0; x < gameboard.width; x++) {
                if (!gameboard.isWater(x, y) || !gameboard.isAttacked(x, y)) {
                    continue;
                }

                this.#cells[this.#getCellIndex(x, y)].classList.add('shot');
            }
        }
    }

    /**
     * Renders a specific ship on the player's board, including hit status.
     * @param {Gameboard} gameboard - The player's gameboard instance.
     * @param {number} type - The ship type.
     */
    setPlayerShip(gameboard, type) {
        const length = Ship.getShipTypeLength(type);
        const coords = new Array(length);
        let location;
        // Try to get the location, note that while development not all ships are placed so getShipLocation
        // throws an exception.
        try {
            location = gameboard.getShipLocation(type);
        }
        catch (err) {
            return;
        }
        // Calculate all coordinates occupied by the ship
        if (location.orientation == Orientation.HORIZONTAL) {
            for (let i = 0; i < length; i++) { coords[i] = [location.x + i, location.y]; }
        }
        else {
            for (let i = 0; i < length; i++) { coords[i] = [location.x, location.y + i]; }
        }
        // Apply classes to the cells.
        for (const coord of coords) {
            const [x, y] = coord;
            const cell   = this.#cells[this.#getCellIndex(x, y)];

            if (gameboard.isAttacked(x, y)) {
                cell.classList.add('shot');
            }
            cell.classList.add('ship');
        }
    }

    /**
     * Renders the state of the opponent's game board as seen by the player.
     * Shows only hits (on ships) and misses (on water). Does *not* reveal unhit ship locations.
     * @param {Gameboard} gameboard - The gameboard instance representing the opponent's board.
     */
    setEnemyWaters(gameboard) {
        this.clearWaters();
        
        for (let y = 0; y < gameboard.height; y++) {
            for (let x = 0; x < gameboard.width; x++) {
                if (!gameboard.isAttacked(x, y)) {
                    continue;
                }

                if (gameboard.isWater(x, y)) {
                    this.#cells[this.#getCellIndex(x, y)].classList.add('shot');
                }
                else {
                    this.#cells[this.#getCellIndex(x, y)].classList.add('shot', 'ship')
                }
            }
        }
    }

    /**
     * Clears the state of the game board.
     */
    clearWaters() {
        for (const cell of this.#cells) {
            cell.classList.remove('shot', 'ship');
        }
    }

    /**
     * Hides the entire display component.
     */
    hide() {
        this.#display.classList.add('hidden');
    }

    /**
     * Shows the entire display component.
     */
    show() {
        this.#display.classList.remove('hidden');
    }

    /**
     * Handles click events delegated from the board container element.
     * @private
     * @param {MouseEvent} event - The click event object.
     */
    #handleCellClick(event) {
        const cell = event.target.closest('.cell');
        if (!cell) {
            return;
        }

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (isNaN(x) || x < 0 || x >= GameboardWidth) {
            console.error(`invalid cell x-coordinate, received ${x}`);
            return;
        }
    
        if (isNaN(y) || y < 0 || y >= GameboardHeight) { 
            console.error(`invalid cell y-coordinate, received ${y}`);
            return;
        }

        this.onCellClick?.(x, y);
    }

    /**
     * Calculates the 1D array index for the internal #cells array based on 2D coordinates.
     * Assumes coordinates are valid.
     * @private
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {number} The calculated index.
     */
    #getCellIndex(x, y) {
        return y * GameboardWidth + x;
    }

    static #createGrid(onRow, onCell) {
        const frag = document.createDocumentFragment();

        for (let y = 0; y < GameboardHeight; y++) {
            frag.appendChild(Display.#createRow(y, onCell));
            onRow?.(y, frag.lastChild);
        }
    
        return frag;
    }

    static #createRow(y, onCell) {
        const frag = document.createDocumentFragment();
        for (let x = 0; x < GameboardWidth; x++) {
            frag.appendChild(Display.#createCell(x, y));
            onCell?.(x, y, frag.lastChild);
        }
    
        return frag;
    }

    static #createCell(x, y) {
        const div = document.createElement('div');
        div.classList.add('cell', `x-${x}`, `y-${y}`);
        div.dataset.x = x;
        div.dataset.y = y;
        return div;
    }
}