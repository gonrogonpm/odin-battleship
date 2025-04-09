import { ShipType } from "./ShipType.js";

describe('ship type', () => {
    describe('ship type can be only one the valid ship types', () => {
        it('should be valid for the different ship types', () => {
            expect(ShipType.isValid(ShipType.CARRIER)).toBeTruthy();
            expect(ShipType.isValid(ShipType.BATTLESHIP)).toBeTruthy();
            expect(ShipType.isValid(ShipType.DESTROYER)).toBeTruthy();
            expect(ShipType.isValid(ShipType.SUBMARINE)).toBeTruthy();
            expect(ShipType.isValid(ShipType.PATROLBOAT)).toBeTruthy();
            expect(ShipType.isValid(0)).toBeTruthy();
            expect(ShipType.isValid(1)).toBeTruthy();
            expect(ShipType.isValid(2)).toBeTruthy();
            expect(ShipType.isValid(3)).toBeTruthy();
            expect(ShipType.isValid(4)).toBeTruthy();
        })

        it('should be not valid for any other value', () => {
            expect(ShipType.isValid(-1)).toBeFalsy();
            expect(ShipType.isValid(5)).toBeFalsy();
            expect(ShipType.isValid()).toBeFalsy();
            expect(ShipType.isValid(null)).toBeFalsy();
            expect(ShipType.isValid(undefined)).toBeFalsy();
            expect(ShipType.isValid({})).toBeFalsy();
        });
    })

    describe('ShipType can be converted to a string', () => {
        it('should return the string representation of a ShipType', () => {
            expect(ShipType.toString(ShipType.CARRIER)).toBe('carrier');
            expect(ShipType.toString(ShipType.BATTLESHIP)).toBe('battleship');
            expect(ShipType.toString(ShipType.DESTROYER)).toBe('destroyer');
            expect(ShipType.toString(ShipType.SUBMARINE)).toBe('submarine');
            expect(ShipType.toString(ShipType.PATROLBOAT)).toBe('patrol boat');
        })

        it('should throw for not valid values', () => {
            expect(() => ShipType.toString(-1)).toThrow(TypeError);
            expect(() => ShipType.toString(5)).toThrow(TypeError);
            expect(() => ShipType.toString()).toThrow(TypeError);
            expect(() => ShipType.toString(null)).toThrow(TypeError);
            expect(() => ShipType.toString(undefined)).toThrow(TypeError);
            expect(() => ShipType.toString({})).toThrow(TypeError);
        });
    })
});