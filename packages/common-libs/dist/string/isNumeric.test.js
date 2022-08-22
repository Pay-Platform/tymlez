"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNumeric_1 = require("./isNumeric");
describe('isNumeric', () => {
    it('should return true for valid number', () => {
        expect((0, isNumeric_1.isNumeric)(123)).toBe(true);
    });
    it.each(['123', '1e10000', '.12', '12.'])('should return true for valid number in string: "%s"', (value) => {
        expect((0, isNumeric_1.isNumeric)(value)).toBe(true);
    });
    it('should return false for string number non-numeric digits', () => {
        expect((0, isNumeric_1.isNumeric)('p123')).toBe(false);
        expect((0, isNumeric_1.isNumeric)('123p')).toBe(false);
        expect((0, isNumeric_1.isNumeric)('12n3')).toBe(false);
    });
    it.each([undefined, null, '', ' ', 'foo', false, '12..', '..12', NaN])('should return false for "%s"', (value) => {
        expect((0, isNumeric_1.isNumeric)(value)).toBe(false);
    });
});
//# sourceMappingURL=isNumeric.test.js.map