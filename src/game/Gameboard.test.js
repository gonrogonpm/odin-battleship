import { Gameboard } from "./Gameboard.js";
import { Ship } from "./Ship.js";
import { ShipType } from "./ShipType.js";
import { Orientation } from "./Orientation.js";

describe("gameboard", () => {
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
    });

    describe('gameboard can be instantiated', () => {
        it('should have width and height', () => {
            expect(gameboard).toHaveProperty('width',  10);
            expect(gameboard).toHaveProperty('height', 10);
        });

        it('should have all of its cells empty', () => {
            for (let y = 0; y < gameboard.height; y++) {
                for (let x = 0; x < gameboard.width; x++) {
                    expect(gameboard.isWater(x, y)).toBeTruthy();
                }
            }
        })

        it('should have no attacked cells', () => {
            for (let y = 0; y < gameboard.height; y++) {
                for (let x = 0; x < gameboard.width; x++) {
                    expect(gameboard.isAttacked(x, y)).toBeFalsy();
                }
            }
        });
    });

    describe('gameboard contains ships', () => {
        it('should allow to place ships horizontally inside the board boundaries', () => {
            const shipType   = ShipType.CARRIER;
            const shipLength = Ship.getShipTypeLength(shipType);
            // Try to place the carrier horizontally in every allowed cell.
            for (let y = 0; y < gameboard.height; y++) {
                for(let x = 0; x < gameboard.width - shipLength; x++) {
                    gameboard.reset();
                    // Place the ship.
                    let result;
                    expect(() => { result = gameboard.placeShip(x, y, Orientation.HORIZONTAL, shipType)}).not.toThrow();
                    expect(result).toBeTruthy();
                    // Check if the board is all water except the carrier position.
                    for (let ty = 0; ty < gameboard.height; ty++) {
                        for (let tx = 0; tx < gameboard.width; tx++) {
                            if (tx >= x && tx < x + shipLength && ty == y) {
                                expect(gameboard.isWater(tx, ty)).toBeFalsy();
                            }
                            else {
                                expect(gameboard.isWater(tx, ty)).toBeTruthy();
                            }
                        }
                    }
                }
            }
        });

        it('should allow to place ships vertically inside the board boundaries', () => {
            const shipType   = ShipType.CARRIER;
            const shipLength = Ship.getShipTypeLength(shipType);
            // Try to place the carrier vertically in every allowed cell.
            for (let x = 0; x < gameboard.width; x++) {
                for(let y = 0; y < gameboard.height - shipLength; y++) {
                    gameboard.reset();
                    // Place the ship.
                    let result;
                    expect(() => { result = gameboard.placeShip(x, y, Orientation.VERTICAL, shipType)}).not.toThrow();
                    expect(result).toBeTruthy();
                    // Check if the board is all water except the carrier position.
                    for (let tx = 0; tx < gameboard.width; tx++) {
                        for (let ty = 0; ty < gameboard.height; ty++) {
                            if (ty >= y && ty < y + shipLength && tx == x) {
                                expect(gameboard.isWater(tx, ty)).toBeFalsy();
                            }
                            else {
                                expect(gameboard.isWater(tx, ty)).toBeTruthy();
                            }
                        }
                    }
                }
            }
        });

        it('should not allow to place ships outside boundaries', () => {
            const shipType   = ShipType.CARRIER;
            const shipLength = Ship.getShipTypeLength(shipType);
            // Try to place the carrier horizontally outside boundaries.
            for (let y = 0; y < gameboard.height; y++) {
                expect(gameboard.placeShip(-1, y, Orientation.HORIZONTAL, shipType)).toBeFalsy();
                expect(gameboard.placeShip(gameboard.width - shipLength + 1, y, Orientation.HORIZONTAL, shipType)).toBeFalsy();
            }
            // Try to place the carrier vertically outside boundaries.
            for (let x = 0; x < gameboard.width; x++) {
                expect(gameboard.placeShip(x, -1, Orientation.VERTICAL, shipType)).toBeFalsy();
                expect(gameboard.placeShip(x, gameboard.height - shipLength + 1, Orientation.VERTICAL, shipType)).toBeFalsy();
            }
        });

        it('should not allow to place the same ships twice', () => {
            expect(gameboard.placeShip(0, 0, Orientation.HORIZONTAL, ShipType.CARRIER)).toBeTruthy();
            expect(gameboard.placeShip(0, 1, Orientation.HORIZONTAL, ShipType.CARRIER)).toBeFalsy();
            expect(gameboard.placeShip(0, 2, Orientation.HORIZONTAL, ShipType.BATTLESHIP)).toBeTruthy();
            expect(gameboard.placeShip(0, 3, Orientation.HORIZONTAL, ShipType.BATTLESHIP)).toBeFalsy();
            expect(gameboard.placeShip(0, 4, Orientation.HORIZONTAL, ShipType.DESTROYER)).toBeTruthy();
            expect(gameboard.placeShip(0, 5, Orientation.HORIZONTAL, ShipType.DESTROYER)).toBeFalsy();
            expect(gameboard.placeShip(0, 6, Orientation.HORIZONTAL, ShipType.SUBMARINE)).toBeTruthy();
            expect(gameboard.placeShip(0, 7, Orientation.HORIZONTAL, ShipType.SUBMARINE)).toBeFalsy();
            expect(gameboard.placeShip(0, 8, Orientation.HORIZONTAL, ShipType.PATROLBOAT)).toBeTruthy();
            expect(gameboard.placeShip(0, 9, Orientation.HORIZONTAL, ShipType.PATROLBOAT)).toBeFalsy();
        });

        it('should not allow to place ships on top of other ships', () => {
            expect(gameboard.placeShip(0, 0, Orientation.HORIZONTAL, ShipType.CARRIER)).toBeTruthy();
            expect(gameboard.placeShip(0, 0, Orientation.HORIZONTAL, ShipType.PATROLBOAT)).toBeFalsy();
            expect(gameboard.placeShip(4, 0, Orientation.HORIZONTAL, ShipType.PATROLBOAT)).toBeFalsy();
            expect(gameboard.placeShip(1, 0, Orientation.HORIZONTAL, ShipType.PATROLBOAT)).toBeFalsy();
            expect(gameboard.placeShip(5, 0, Orientation.HORIZONTAL, ShipType.BATTLESHIP)).toBeTruthy();
            gameboard.reset();
            expect(gameboard.placeShip(0, 0, Orientation.VERTICAL, ShipType.CARRIER)).toBeTruthy();
            expect(gameboard.placeShip(0, 0, Orientation.VERTICAL, ShipType.PATROLBOAT)).toBeFalsy();
            expect(gameboard.placeShip(0, 4, Orientation.VERTICAL, ShipType.PATROLBOAT)).toBeFalsy();
            expect(gameboard.placeShip(0, 1, Orientation.VERTICAL, ShipType.PATROLBOAT)).toBeFalsy();
            expect(gameboard.placeShip(0, 5, Orientation.VERTICAL, ShipType.BATTLESHIP)).toBeTruthy();
        });

        it('should not allow to place ship with an invalid orientation', () => {
            expect(() => gameboard.placeShip(5, 5, -1, ShipType.CARRIER)).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, 'a', ShipType.CARRIER)).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, {}, ShipType.CARRIER)).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, null, ShipType.CARRIER)).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, undefined, ShipType.CARRIER)).toThrow(TypeError);
        });

        it('should not allow to place ship with an invalid type', () => {
            expect(() => gameboard.placeShip(5, 5, Orientation.HORIZONTAL, -1)).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, Orientation.HORIZONTAL, 'a')).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, Orientation.HORIZONTAL, {})).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, Orientation.HORIZONTAL, null)).toThrow(TypeError);
            expect(() => gameboard.placeShip(5, 5, Orientation.HORIZONTAL, undefined)).toThrow(TypeError);
        });

        it('should allow to retrieve the location of the ships', () => {
            expect(() => gameboard.getShipLocation(ShipType.CARRIER))   .toThrow();
            expect(() => gameboard.getShipLocation(ShipType.BATTLESHIP)).toThrow();
            expect(() => gameboard.getShipLocation(ShipType.DESTROYER)) .toThrow();
            expect(() => gameboard.getShipLocation(ShipType.SUBMARINE)) .toThrow();
            expect(() => gameboard.getShipLocation(ShipType.PATROLBOAT)).toThrow();

            gameboard.placeShip(1, 8, Orientation.HORIZONTAL, ShipType.CARRIER);
            gameboard.placeShip(8, 3, Orientation.VERTICAL, ShipType.BATTLESHIP);
            gameboard.placeShip(0, 2, Orientation.VERTICAL, ShipType.DESTROYER);
            gameboard.placeShip(2, 6, Orientation.HORIZONTAL, ShipType.SUBMARINE);
            gameboard.placeShip(3, 0, Orientation.HORIZONTAL, ShipType.PATROLBOAT);

            expect(gameboard.getShipLocation(ShipType.CARRIER))   .toMatchObject({orientation: Orientation.HORIZONTAL, x: 1, y: 8});
            expect(gameboard.getShipLocation(ShipType.BATTLESHIP)).toMatchObject({orientation: Orientation.VERTICAL, x: 8, y: 3});
            expect(gameboard.getShipLocation(ShipType.DESTROYER)) .toMatchObject({orientation: Orientation.VERTICAL, x: 0, y: 2});
            expect(gameboard.getShipLocation(ShipType.SUBMARINE)) .toMatchObject({orientation: Orientation.HORIZONTAL, x: 2, y: 6});
            expect(gameboard.getShipLocation(ShipType.PATROLBOAT)).toMatchObject({orientation: Orientation.HORIZONTAL, x: 3, y: 0});
        });
    });

    describe('gameboard can receive attacks', () => {
        let gameboardWithShips;

        beforeEach(() => {
            gameboardWithShips = new Gameboard();
            gameboardWithShips.placeShip(1, 8, Orientation.HORIZONTAL, ShipType.CARRIER);
            gameboardWithShips.placeShip(8, 3, Orientation.VERTICAL, ShipType.BATTLESHIP);
            gameboardWithShips.placeShip(0, 2, Orientation.VERTICAL, ShipType.DESTROYER);
            gameboardWithShips.placeShip(2, 6, Orientation.HORIZONTAL, ShipType.SUBMARINE);
            gameboardWithShips.placeShip(3, 0, Orientation.HORIZONTAL, ShipType.PATROLBOAT);
        });

        it('should report all ships sunk if no ships are placed', () => {
            expect(gameboard.isAllSunk()).toBeTruthy();
        });

        it('should allow to attack on any valid cell', () => {
            for (let y = 0; y < gameboard.height; y++) {
                for (let x = 0; x < gameboard.width; x++) {
                    expect(gameboard.receiveAttack(x, y)).toMatchObject({ success: true, ship: -1 });
                }
            }
            // Check if the attacks are registered.
            for (let y = 0; y < gameboard.height; y++) {
                for (let x = 0; x < gameboard.width; x++) {
                    expect(gameboard.isAttacked(x, y)).toBeTruthy();
                }
            }
        });

        it('should not allow to attack outside board boundaries', () => {
            for (let y of [-1, gameboard.height]) {
                for (let x of [-1, gameboard.width]) {
                    expect(() => gameboard.receiveAttack(x, y)).toThrow(RangeError);
                }
            }
        });

        it('should report the ship that has been hit when the attack guesses its position', () => {
            const attacks = [
                [ShipType.CARRIER, 1, 8],
                [ShipType.CARRIER, 5, 8],
                [ShipType.BATTLESHIP, 8, 3],
                [ShipType.BATTLESHIP, 8, 6],
                [ShipType.DESTROYER, 0, 2],
                [ShipType.DESTROYER, 0, 4],
                [ShipType.SUBMARINE, 2, 6],
                [ShipType.SUBMARINE, 4, 6],
                [ShipType.PATROLBOAT, 3, 0],
                [ShipType.PATROLBOAT, 4, 0],
            ];

            for (let attack of attacks) {
                expect(gameboardWithShips.receiveAttack(attack[1], attack[2])).toMatchObject({ success: true, ship: attack[0] });
            }
            // Check if the attacks are registered.
            for (let y = 0; y < gameboard.height; y++) {
                for (let x = 0; x < gameboard.width; x++) {
                    if (attacks.find(attack => attack[1] === x && attack[2] === y)) {
                        expect(gameboardWithShips.isAttacked(x, y)).toBeTruthy();
                    }
                    else {
                        expect(gameboardWithShips.isAttacked(x, y)).toBeFalsy();
                    }
                }
            }
        });

        it('should report failure if the cell was already attacked', () => {
            expect(gameboardWithShips.receiveAttack(1, 8)).toMatchObject({ success: true, ship: ShipType.CARRIER });
            expect(gameboardWithShips.receiveAttack(1, 8)).toMatchObject({ success: false });
            expect(gameboardWithShips.receiveAttack(0, 0)).toMatchObject({ success: true, ship: -1 });
            expect(gameboardWithShips.receiveAttack(0, 0)).toMatchObject({ success: false });
        });

        it('should report if the the ship that has been hit is sunk or not', () => {
            expect(gameboardWithShips.receiveAttack(2, 6)).toMatchObject({ success: true, ship: ShipType.SUBMARINE, sunk: false });
            expect(gameboardWithShips.receiveAttack(0, 0)).toMatchObject({ success: true, ship: -1 });
            expect(gameboardWithShips.receiveAttack(3, 6)).toMatchObject({ success: true, ship: ShipType.SUBMARINE, sunk: false });
            expect(gameboardWithShips.receiveAttack(3, 9)).toMatchObject({ success: true, ship: -1 });
            expect(gameboardWithShips.receiveAttack(4, 9)).toMatchObject({ success: true, ship: -1 });
            expect(gameboardWithShips.receiveAttack(4, 6)).toMatchObject({ success: true, ship: ShipType.SUBMARINE, sunk: true });
        });

        it('should report if all ships are sunk', () => {
            const attacks = [
                [ShipType.CARRIER, 1, 8],
                [ShipType.CARRIER, 2, 8],
                [ShipType.CARRIER, 3, 8],
                [ShipType.CARRIER, 4, 8],
                [ShipType.CARRIER, 5, 8],
                [ShipType.BATTLESHIP, 8, 3],
                [ShipType.BATTLESHIP, 8, 4],
                [ShipType.BATTLESHIP, 8, 5],
                [ShipType.BATTLESHIP, 8, 6],
                [ShipType.DESTROYER, 0, 2],
                [ShipType.DESTROYER, 0, 3],
                [ShipType.DESTROYER, 0, 4],
                [ShipType.SUBMARINE, 2, 6],
                [ShipType.SUBMARINE, 3, 6],
                [ShipType.SUBMARINE, 4, 6],
                [ShipType.PATROLBOAT, 3, 0],
                [ShipType.PATROLBOAT, 4, 0],
            ];

            expect(gameboardWithShips.isAllSunk()).toBeFalsy();
            gameboardWithShips.receiveAttack(0, 0);
            gameboardWithShips.receiveAttack(3, 9);
            gameboardWithShips.receiveAttack(4, 9);
            expect(gameboardWithShips.isAllSunk()).toBeFalsy();

            for (let i = 0; i < attacks.length; i++) {
                const attack = attacks[i];
                expect(gameboardWithShips.receiveAttack(attack[1], attack[2])).toMatchObject({ success: true, ship: attack[0] });
                // For the last attack all ships must be sunk.
                if (i >= attacks.length - 1) {
                    expect(gameboardWithShips.isAllSunk()).toBeTruthy();
                }
                else {
                    expect(gameboardWithShips.isAllSunk()).toBeFalsy();
                }
            }
        });
    });
});