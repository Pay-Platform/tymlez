import { matchAll } from './matchAll';

describe('matchAll', () => {
  it('should return all properties with Date type', () => {
    expect(
      matchAll(
        /^.*: Date/m,
        `
          interface ITest {
            start: Date,
            value: number;
            end: Date
          }
        `,
      ),
    ).toMatchInlineSnapshot(`
      Array [
        "            start: Date",
        "            end: Date",
      ]
    `);
  });

  it('should return no property with Date type', () => {
    expect(
      matchAll(
        /^.*: Date/m,
        `
          interface ITest {
            value: number;
          }
        `,
      ),
    ).toMatchInlineSnapshot(`Array []`);
  });
});
