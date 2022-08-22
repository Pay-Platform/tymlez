import { isNumeric } from './isNumeric';

describe('isNumeric', () => {
  it('should return true for valid number', () => {
    expect(isNumeric(123)).toBe(true);
  });

  it.each(['123', '1e10000', '.12', '12.'])(
    'should return true for valid number in string: "%s"',
    (value) => {
      expect(isNumeric(value)).toBe(true);
    },
  );

  it('should return false for string number non-numeric digits', () => {
    expect(isNumeric('p123')).toBe(false);
    expect(isNumeric('123p')).toBe(false);
    expect(isNumeric('12n3')).toBe(false);
  });

  it.each([undefined, null, '', ' ', 'foo', false, '12..', '..12', NaN])(
    'should return false for "%s"',
    (value) => {
      expect(isNumeric(value)).toBe(false);
    },
  );
});
