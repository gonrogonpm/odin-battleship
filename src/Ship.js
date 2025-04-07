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
     * Creates an instance of a ship.
     * @param {number} length - The length of the ship (must be between MIN_LENGTH and MAX_LENGTH).
     * @throws {TypeError} if length is not a number.
     * @throws {RangeError} if length is out of the valid range.
     */
    constructor(length) {
        if (typeof length !== 'number') {
            throw TypeError(`length must be a number, received type: ${typeof length}`);
        }

        if (length < Ship.MIN_LENGTH || length > Ship.MAX_LENGTH) {
            throw RangeError(`length must be between ${Ship.MIN_LENGTH} and ${Ship.MAX_LENGTH}, received: ${length}`);
        }

        this.#length = length;
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