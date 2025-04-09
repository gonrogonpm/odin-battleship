import { Orientation } from "./Orientation.js";

describe('orientation', () => {
    describe('orientation can be only horizontal or vertical', () => {
        it('should be valid for horizontal and vertical values', () => {
            expect(Orientation.isValid(Orientation.HORIZONTAL)).toBeTruthy();
            expect(Orientation.isValid(Orientation.VERTICAL)).toBeTruthy();
            expect(Orientation.isValid(0)).toBeTruthy();
            expect(Orientation.isValid(1)).toBeTruthy();
        })

        it('should be not valid for any other value', () => {
            expect(Orientation.isValid(-1)).toBeFalsy();
            expect(Orientation.isValid(2)).toBeFalsy();
            expect(Orientation.isValid()).toBeFalsy();
            expect(Orientation.isValid(null)).toBeFalsy();
            expect(Orientation.isValid(undefined)).toBeFalsy();
            expect(Orientation.isValid({})).toBeFalsy();
        });
    })

    describe('orientation can be converted to a string', () => {
        it('should return the string representation of a orientation', () => {
            expect(Orientation.toString(Orientation.HORIZONTAL)).toBe('horizontal');
            expect(Orientation.toString(Orientation.VERTICAL)).toBe('vertical');
        })

        it('should throw for not valid values', () => {
            expect(() => Orientation.toString(-1)).toThrow(TypeError);
            expect(() => Orientation.toString(2)).toThrow(TypeError);
            expect(() => Orientation.toString()).toThrow(TypeError);
            expect(() => Orientation.toString(null)).toThrow(TypeError);
            expect(() => Orientation.toString(undefined)).toThrow(TypeError);
            expect(() => Orientation.toString({})).toThrow(TypeError);
        });
    })
});