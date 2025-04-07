import { ShipType } from './ShipType.js';

/**
 * Defines a ship in the battleship game.
 */
export class Ship {
    static MAX_LENGTH = 5;
    static MIN_LENGTH = 1;

    /**
     * Length of the ship.
     * @private
     */
    #length = 0;

    /**
     * Number of hits.
     * @private
     */
    #hits = 0;

    /**
     * Type of ship.
     */
    #type = 0;

    /**
     * Creates an instance of a ship based on its type.
     * @param {number} type - The type of the ship (must be a valid value from ShipType enum).
     * @throws {TypeError} if the provided type is not a valid ship type.
     */
    constructor(type) {
        if (!ShipType.isValid(type)) {
            throw TypeError(`invalid ship type, received ${type}`);
        }
        // Set the length for each ship type.
        switch (type) {
            case ShipType.CARRIER:    this.#length = 5; break;
            case ShipType.BATTLESHIP: this.#length = 4; break;
            case ShipType.DESTROYER:  this.#length = 3; break;
            case ShipType.SUBMARINE:  this.#length = 3; break;
            default:                  this.#length = 2; break;
        }
        // Save the ship type.
        this.#type = type;
    }

    /**
     * Gets the length of the ship.
     * @returns {number}
     */
    get length() {
        return this.#length;
    }

    /**
     * Gets the number of hits of the ship.
     * @returns {number}
     */
    get hits() { 
        return this.#hits;
    }

    /**
     * Gets the ship type.
     * @returns {number}
     */
    get type() { 
        return this.#type;
    }

    /**
     * Checks if the ship has been sunk.
     * A ship is sunk if the number of hits is equal to or greater than its length.
     * @returns {boolean} True if the ship is sunk, false otherwise.
     */
    isSunk() {
        return this.#hits >= this.#length;
    }

    /**
     * Registers a hit on the ship.
     * Increments the hit count, but not beyond the ship's length.
     */
    hit() {
        this.#hits = Math.min(this.#hits + 1, this.#length);
    }
}