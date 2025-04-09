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
        this.#length = Ship.getShipTypeLength(type);
        this.#type   = type;
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

    /**
     * Gets the length for each type of ship.
     * @param {number} type - The type of the ship (must be a valid value from ShipType enum).
     * @returns {number} Length.
     * @throws {TypeError} if the provided type is not a valid ship type.
     */
    static getShipTypeLength(type) {
        if (!ShipType.isValid(type)) {
            throw TypeError(`invalid ship type, received ${type}`);
        }
        // Set the length for each ship type.
        switch (type) {
            case ShipType.CARRIER:    return 5;
            case ShipType.BATTLESHIP: return 4;
            case ShipType.DESTROYER:  return 3;
            case ShipType.SUBMARINE:  return 3;
            default:                  return 2;
        }
    }
}