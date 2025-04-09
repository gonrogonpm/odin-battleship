import { Ship } from "./Ship.js";
import { ShipType } from "./ShipType.js";

describe('ship', () => {
    describe('ship length can be retrieved', () => {
        it('should return the right length for each valid ship type', () => {
            expect(Ship.getShipTypeLength(ShipType.CARRIER)).toBe(5);
            expect(Ship.getShipTypeLength(ShipType.BATTLESHIP)).toBe(4);
            expect(Ship.getShipTypeLength(ShipType.DESTROYER)).toBe(3);
            expect(Ship.getShipTypeLength(ShipType.SUBMARINE)).toBe(3);
            expect(Ship.getShipTypeLength(ShipType.PATROLBOAT)).toBe(2);
        });

        it('should throw if the ship type is not valid', () => {
            expect(() => Ship.getShipTypeLength(-1)).toThrow(TypeError);
            expect(() => Ship.getShipTypeLength(5)).toThrow(TypeError);
            expect(() => Ship.getShipTypeLength('a')).toThrow(TypeError);
            expect(() => Ship.getShipTypeLength({})).toThrow(TypeError);
            expect(() => Ship.getShipTypeLength(null)).toThrow(TypeError);
            expect(() => Ship.getShipTypeLength(undefined)).toThrow(TypeError);
        });
    });

    describe('ship can be instantiated', () => {
        it('should have length', () => {
            const ship = new Ship(ShipType.PATROLBOAT);
            expect(ship).toHaveProperty('length');
            expect(typeof ship.length).toBe('number');
            expect(ship.length).toBe(2);
        });

        it('should have the right length for each valid ship type', () => {
            expect(new Ship(ShipType.CARRIER).length).toBe(5);
            expect(new Ship(ShipType.BATTLESHIP).length).toBe(4);
            expect(new Ship(ShipType.DESTROYER).length).toBe(3);
            expect(new Ship(ShipType.SUBMARINE).length).toBe(3);
            expect(new Ship(ShipType.PATROLBOAT).length).toBe(2);
        });

        it('should have a number of hits', () => {
            const ship = new Ship(ShipType.PATROLBOAT);
            expect(ship).toHaveProperty('hits');
            expect(typeof(ship.hits)).toBe('number');
            expect(ship.hits).toBe(0);
        });

        it('should have an initial sunk state of false', () => {
            const ship = new Ship(ShipType.CARRIER);
            expect(ship.isSunk()).toBeFalsy();
        });
      
        it('should throw if the ship type is not valid', () => {
            expect(() => new Ship(-1)).toThrow(TypeError);
            expect(() => new Ship(5)).toThrow(TypeError);
            expect(() => new Ship('a')).toThrow(TypeError);
            expect(() => new Ship({})).toThrow(TypeError);
            expect(() => new Ship(null)).toThrow(TypeError);
            expect(() => new Ship(undefined)).toThrow(TypeError);
        });
    });

    describe('ship can be hit', () => {
        it('should count the number of hits', () => {
            const ship = new Ship(ShipType.PATROLBOAT);
            ship.hit();
            ship.hit();
            expect(ship.hits).toBe(2);
            expect(ship.isSunk()).toBeTruthy();
        });

        it('should not count hits beyond ship length', () => {
            const ship = new Ship(ShipType.PATROLBOAT);
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.hits).toBe(2);
            expect(ship.isSunk()).toBeTruthy();
        })

        it('should not sink if the hits are less than the length', () => {
            const ship = new Ship(ShipType.CARRIER);
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.hits).toBe(3);
            expect(ship.isSunk()).toBeFalsy();
        })
    });
});