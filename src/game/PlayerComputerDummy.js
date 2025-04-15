import { Orientation } from "./Orientation.js";
import { Player } from "./Player.js";
import { ShipType } from "./ShipType.js";

const RandomPlacementAttemps = 5;

export class PlayerComputerDummy extends Player {
    constructor(gameboard) {
        super(gameboard);
    }

    placeShips() {
        for (let type = ShipType.CARRIER; type <= ShipType.PATROLBOAT; type++) {
            if (!this.#placeShipRandom(type, RandomPlacementAttemps)) {
                throw Error(`Unable to place ship: ${ShipType.toString(type)}`);
            }
        }
    }

    /**
     * Calculates a target in the enemy game board.
     * @param {Player} enemy Enemy player.
     * @return {number[] | null} Array with the coordinates to attack.
     * @throws {Error} If all enemy cells are already attacked.
     */
    aim(enemy) {
        const x = Math.floor(Math.random() * this._gameboard.width);
        const y = Math.floor(Math.random() * this._gameboard.height);

        for (let i = 0; i < this._gameboard.height; i++) {
            for (let j = 0; j < this._gameboard.width; j++) {
                const px = (x + j) % this._gameboard.width;
                const py = (y + i) % this._gameboard.height;

                if (enemy.isAttacked(px, py)) {
                    continue;
                }

                return [x, y];
            }
        }
        // This should not happen because game should end before this.
        throw Error('Unable to aim, all enemy cells are already attacked');
    }

    #placeShipRandom(type) {
        const x = Math.floor(Math.random() * this._gameboard.width);
        const y = Math.floor(Math.random() * this._gameboard.height);
        const o = [Orientation.HORIZONTAL, Orientation.VERTICAL]
        if (Math.random() >= 0.5) {
            o.reverse();
        }

        for (let orientation of o) {
            if (this.#placeShipSequentially(x, y, orientation, type)) {
                return true;
            }
        }
        // This method should never fail as there is always a valid location to place the standard ships.
        return false;
    }

    #placeShipSequentially(x, y, orientation, type) {
        if (orientation === Orientation.HORIZONTAL) {
            return this.#placeShipSequentiallyHorizontal(x, y, type);
        }
        else {
            return this.#placeShipSequentiallyVertical(x, y, type);
        }
    }

    #placeShipSequentiallyHorizontal(x, y, type) {
        // Try to place the ship horizontally in each row, starting at position (x, y), until it is successfully placed.
        for (let i = 0; i < this._gameboard.height; i++) {
            const py = (y + i) % this._gameboard.height;
            // Try to place the ship horizontally in a position inside the row.
            for (let j = 0; j < this._gameboard.width; j++) {
                const px = (x + j) % this._gameboard.width;
                if (this._gameboard.placeShip(px, py, Orientation.HORIZONTAL, type)) {
                    return true;
                }
            }
        }

        return false;
    }

    #placeShipSequentiallyVertical(x, y, type) {
        // Try to place the ship vertically in each column, starting at position (x, y), until it is successfully placed.
        for (let i = 0; i < this._gameboard.width; i++) {
            const px = (x + i) % this._gameboard.width;
            // Try to place the ship vertically in a position inside the column.
            for (let j = 0; j < this._gameboard.height; j++) {
                const py = (y + j) % this._gameboard.height;
                if (this._gameboard.placeShip(px, py, Orientation.VERTICAL, type)) {
                    return true;
                }
            }
        }

        return false;
    }
}