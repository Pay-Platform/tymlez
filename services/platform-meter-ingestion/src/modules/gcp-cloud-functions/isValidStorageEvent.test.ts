import { suppressConsole, restoreConsole } from '@tymlez/test-libs/src/jest';
import type { IStorageEvent } from './IStorageEvent';
import { isValidStorageEvent } from './isValidStorageEvent';

beforeAll(() => {
  suppressConsole({ debug: false });
});

afterAll(() => {
  restoreConsole();
});

describe('isValidEvent', () => {
  it.each(['test/', '/', 'test', 'test.txt'])(
    `should return false for incorrect postfix: "%s"`,
    (name) => {
      expect(
        isValidStorageEvent(
          {
            name,
          } as IStorageEvent,
          '',
          '.json',
        ),
      ).toBe(false);
    },
  );

  it.each(['test.json', 'foo/bar/test.json'])(
    `should return true for correct postfix: "%s"`,
    (name) => {
      expect(
        isValidStorageEvent(
          {
            name,
            size: '1',
          } as IStorageEvent,
          '',
          '.json',
        ),
      ).toBe(true);
    },
  );

  it(`should return false when file size is 0`, () => {
    expect(
      isValidStorageEvent({
        name: 'test.json',
        size: '0',
      } as IStorageEvent),
    ).toBe(false);
  });

  it.each(['test.json', '/', 'bar/test.json'])(
    `should return false for incorrect prefix: "%s"`,
    (name) => {
      expect(
        isValidStorageEvent(
          {
            name,
            size: '1',
          } as IStorageEvent,
          'foo/',
        ),
      ).toBe(false);
    },
  );

  it.each(['foo/test.json', 'foo/', 'foo/bar/test.json'])(
    `should return true for correct prefix: "%s"`,
    (name) => {
      expect(
        isValidStorageEvent(
          {
            name,
            size: '1',
          } as IStorageEvent,
          'foo/',
        ),
      ).toBe(true);
    },
  );

  it.each(['test.json', '/', 'bar/test.json', 'foo/test.txt', 'foo/'])(
    `should return false for incorrect prefix or postfix: "%s"`,
    (name) => {
      expect(
        isValidStorageEvent(
          {
            name,
            size: '1',
          } as IStorageEvent,
          'foo/',
          '.json',
        ),
      ).toBe(false);
    },
  );

  it.each(['foo/test.json', 'foo/bar/test.json'])(
    `should return true if both prefix and postfix is correct: "%s"`,
    (name) => {
      expect(
        isValidStorageEvent(
          {
            name,
            size: '1',
          } as IStorageEvent,
          'foo/',
          '.json',
        ),
      ).toBe(true);
    },
  );
});
