/**
 * Enumeration representing ship types.
 * @enum {number}
 * @readonly
 */
export const ShipType = Object.freeze({
    CARRIER:     0,
    BATTLESHIP:  1,
    DESTROYER:   2,
    SUBMARINE:   3,
    PATROLBOAT:  4,

    /**
     * Checks if a value is a valid ship type enum value.
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is a valid ship type.
     */
    isValid: function(value) {
        if (typeof value !== 'number') {
            return false;
        }

        if (value < this.CARRIER || value > this.PATROLBOAT) {
            return false;
        }

        return true;
    },

    /**
     * Gets the string representation of an ship type.
     * @param {number} value - The ship type value.
     * @returns {string} - string with the ship type.
     * @throws {TypeError} if the value is not a valid ship type.
     */
    toString: function(value) {
        if (!this.isValid(value)) {
            throw TypeError(`value must be a valid ship type, received: ${value}`);
        }

        switch (value) {
            case ShipType.CARRIER:    return 'carrier';
            case ShipType.BATTLESHIP: return 'battleship';
            case ShipType.DESTROYER:  return 'destroyer';
            case ShipType.SUBMARINE:  return 'submarine';
            default:                  return 'patrol boat';
        }
    }
});