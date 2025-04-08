import { Gameboard } from "./Gameboard.js";

export class Player {
    _gameboard;

    constructor(gameboard) {
        if (gameboard instanceof Gameboard) {
            throw TypeError(`gameboard must be a Gameboard, received: ${typeof gameboard}`);
        }

        this._gameboard = gameboard ?? new Gameboard();
    }

    isAllSunk() {
        return this._gameboard.isAllSunk();
    }

    isAttacked(x, y) {
        return this._gameboard.isAttacked(x, y);
    }

    receiveAttack(x, y) {
        return this._gameboard.receiveAttack(x, y);
    }
}