"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchAll_1 = require("./matchAll");
describe('matchAll', () => {
    it('should return all properties with Date type', () => {
        expect((0, matchAll_1.matchAll)(/^.*: Date/m, `
          interface ITest {
            start: Date,
            value: number;
            end: Date
          }
        `)).toMatchInlineSnapshot(`
      Array [
        "            start: Date",
        "            end: Date",
      ]
    `);
    });
    it('should return no property with Date type', () => {
        expect((0, matchAll_1.matchAll)(/^.*: Date/m, `
          interface ITest {
            value: number;
          }
        `)).toMatchInlineSnapshot(`Array []`);
    });
});
//# sourceMappingURL=matchAll.test.js.map