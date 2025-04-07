/**
 * Enumeration representing ship orientation.
 * @enum {number}
 * @readonly
 */
export const Orientation = Object.freeze({
    HORIZONTAL: 0,
    VERTICAL:   1,

    /**
     * Checks if a value is a valid orientation enum value.
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is a valid direction.
     */
    isValid: function(value) {
        if (typeof value !== 'number') {
            return false;
        }

        if (value < this.HORIZONTAL || value > this.VERTICAL) {
            return false;
        }

        return true;
    },

    /**
     * Gets the string representation of an orientation.
     * @param {number} value - The orientation value.
     * @returns {string} - 'horizontal' or 'vertical'.
     * @throws {TypeError} if the value is not a valid direction.
     */
    toString: function(value) {
        if (!this.isValid(value)) {
            throw TypeError(`value must be a valid orientation, received: ${value}`);
        }

        return value === 0 ? 'horizontal' : 'vertical';
    }
});