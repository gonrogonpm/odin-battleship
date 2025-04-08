import { Ship } from './Ship.js';
import { Orientation } from './Orientation.js';

const GameboardWidth  = 10;
const GameboardHeight = 10;
const WaterValue      = -1;

/**
 * Defines the game board for a battleship game.
 * Manages ship placement, tracks shots, and determines game state.
 */
export class Gameboard {
    /** @private @type {Ship[]} Array storing the ship objects placed on the board. */
    #ships;
    /** @private @type {number[]} 1D array representing the board grid. Stores WaterValue (-1) or the index of the ship in #ships. */
    #board;
    /** @private @type {number[]} 1D array tracking the number of shots, 0 = not shot, > 0 = shot. */
    #shots;

    /**
     * Creates an instance of Gameboard and initializes it.
     */
    constructor() {
        this.reset();
    }

    /**
     * @returns {number} The board width.
     */
    get width() {
        return GameboardWidth;
    }

    /**
     * @returns {number} The board height.
     */
    get height() { 
        return GameboardHeight;
    }

    /**
     * Checks if the cell at the given coordinates contains water.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {boolean} True if the cell is water, false otherwise (contains a ship).
     * @throws {RangeError} If coordinates are out of bounds.
     */
    isWater(x, y) {
        return this.#board[this.#getIndex(x, y)] < 0;
    }

    /**
     * Checks if the cell at the given coordinates has already been attacked.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {boolean} True if the cell has been attacked, false otherwise.
     * @throws {RangeError} If coordinates are out of bounds.
     */
    isAttacked(x, y) {
        return this.#shots[this.#getIndex(x, y)] > 0;
    }

    /**
     * Checks if all ships placed on the board have been sunk.
     * @returns {boolean} True if all ships are sunk, false otherwise.
     */
    isAllSunk() {
        for (const ship of this.#ships) {
            if (!ship.isSunk()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Attempts to place a ship of a given type at the specified coordinates and orientation.
     * Performs checks for boundaries and overlaps.
     * @param {number} x - The starting x-coordinate of the ship (top-leftmost part).
     * @param {number} y - The starting y-coordinate of the ship (top-leftmost part).
     * @param {number} orientation - The orientation of the ship (use a value from the Orientation enum).
     * @param {number} type - The type of the ship (use a value from the ShipType enum).
     * @returns {boolean} True if the ship was placed successfully, false if placement failed (out of bounds, overlaps
     * another ship, or invalid starting coordinates).
     * @throws {TypeError} If the provided orientation or type is invalid.
     */
    placeShip(x, y, orientation, type) {
        if (!Orientation.isValid(orientation)) {
            throw TypeError(`orientation must be a valid orientation, received: ${orientation}`);
        }

        const ship = new Ship(type);
        // Check starting coordinates are within bounds before calculating end points.
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false;
        }
        // Boundaries check.
        if (orientation == Orientation.HORIZONTAL) {
            if (x + ship.length > this.width) {
                return false;
            }
        }
        else {
            if (y + ship.length > this.height) {
                return false;
            }
        }
        // Overlap checks.
        if (orientation == Orientation.HORIZONTAL) {
            for (let px = x; px < x + ship.length; px++) {
                if (!this.isWater(px, y)) {
                    return false;
                }
            }
        }
        else {
            for (let py = y; py < y + ship.length; py++) {
                if (!this.isWater(x, py)) {
                    return false;
                }
            }
        }
        // Add the ship.
        const index = this.#ships.length;
        this.#ships.push(ship);
        // Update the board with the ship index.
        if (orientation == Orientation.HORIZONTAL) {
            for (let px = x; px < x + ship.length; px++) {
                this.#board[this.#getIndex(px, y)] = index;
            }
        }
        else {
            for (let py = y; py < y + ship.length; py++) {
                this.#board[this.#getIndex(x, py)] = index;
            }
        }

        return true;
    }

    /**
     * @typedef {object} AttackResult
     * @property {boolean} success - Indicates if the attack was valid (true) or on an already attacked cell (false).
     * @property {number} ship - The type the ship hit, or WaterValue (-1) if it was a miss or an invalid attack (already shot).
     * @property {boolean} [sunk] - Optional. Present only on a successful hit on a ship. True if the hit caused the ship to sink, false otherwise.
     */

    /**
     * Processes an attack on the given coordinates.
     * Marks the cell as attacked and determines if a ship was hit.
     * @param {number} x - The x-coordinate of the attack.
     * @param {number} y - The y-coordinate of the attack.
     * @returns {AttackResult} An object detailing the result of the attack.
     * @throws {RangeError} If coordinates are out of bounds.
     */
    receiveAttack(x, y) {
        const index = this.#getIndex(x, y);
        // Check if the position has already received an attack.
        if (this.#shots[index] > 0) {
            return { success: false, ship: WaterValue };
        }
        this.#shots[index]++;
        // Check what is in the impact point.
        const content = this.#board[index];
        if (content < 0) {
            return { success: true, ship: WaterValue };
        }

        const ship = this.#ships[content];
        ship.hit();

        return { success: true, ship: ship.type, sunk: ship.isSunk() }
    }

    /**
     * Resets the game board to its initial empty state.
     * Clears all placed ships and recorded shots.
     */
    reset() {
        this.#ships = [];
        this.#board = new Array(GameboardWidth * GameboardHeight).fill(WaterValue);
        this.#shots = new Array(GameboardWidth * GameboardHeight).fill(0);
    }

    /**
     * Calculates the 1D array index corresponding to the given 2D coordinates.
     * Also validates that the coordinates are within the board boundaries.
     * @private
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {number} The calculated index in the 1D board arrays.
     * @throws {RangeError} If the coordinates are outside the board dimensions.
     */
    #getIndex(x, y) {
        if (x < 0 || y < 0 || x >= GameboardWidth || y >= GameboardHeight) {
            throw RangeError(`position must be inside board, received: ${x}, ${y}`);
        }

        return y * GameboardWidth + x;
    }
}