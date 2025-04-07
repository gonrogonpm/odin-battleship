import { Ship } from "./Ship.js";

describe('ship', () => {
    describe('ship can be instantiated', () => {
        it('should have length', () => {
            const ship = new Ship(1);
            expect(ship).toHaveProperty('length');
            expect(typeof ship.length).toBe('number');
            expect(ship.length).toBe(1);
        });

        it('should have a number of hits', () => {
            const ship = new Ship(1);
            expect(ship).toHaveProperty('hits');
            expect(typeof(ship.hits)).toBe('number');
            expect(ship.hits).toBe(0);
        });

        it('should have a sunk flag', () => {
            const ship = new Ship(1);
            expect(ship.isSunk()).toBeFalsy();
        });

        it('should throw if the length is not inside the valid range [1, 5]', () => {
            expect(() => new Ship(0)).toThrow(RangeError);
            expect(() => new Ship(6)).toThrow(RangeError);

            for (let l = 1; l <= 5; l++) {
                let ship;
                expect(() => { ship = new Ship(l); }).not.toThrow(RangeError);
                expect(ship.length).toBe(l);
            }
        });

        it('should throw if the length is not valid', () => {
            expect(() => new Ship('a')).toThrow(TypeError);
            expect(() => new Ship({})).toThrow(TypeError);
            expect(() => new Ship(null)).toThrow(TypeError);
            expect(() => new Ship(undefined)).toThrow(TypeError);
        });
    });

    describe('ship can be hit', () => {
        it('should count the number of hits', () => {
            const ship = new Ship(1);
            ship.hit();
            expect(ship.hits).toBe(1);
            expect(ship.isSunk()).toBeTruthy();
        });

        it('should not count hits beyond ship length', () => {
            const ship = new Ship(2);
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.hits).toBe(2);
            expect(ship.isSunk()).toBeTruthy();
        })

        it('should not sink if the hits are less than the length', () => {
            const ship = new Ship(4);
            ship.hit();
            ship.hit();
            ship.hit();
            expect(ship.hits).toBe(3);
            expect(ship.isSunk()).toBeFalsy();
        })
    });
});