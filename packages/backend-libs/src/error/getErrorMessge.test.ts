import FakeTimers from '@sinonjs/fake-timers';
import { getErrorMessage } from './getErrorMessage';

let clock: FakeTimers.InstalledClock;
beforeAll(() => {
  clock = FakeTimers.install({
    shouldAdvanceTime: true,
    now: new Date('2021-12-15T12:00:00Z'),
  });
});

afterAll(() => {
  clock.uninstall();
});

describe('getErrorMessage', () => {
  it('should return error with timestamp, logPrefix and error message', () => {
    expect(
      getErrorMessage({
        err: new Error('Unit test error 1'),
        logPrefix: 'log prefix 1',
      }),
    ).toMatchInlineSnapshot(`
      "Error: 2021-12-15T12:00:00.000Z: \`log prefix 1\`: 
      \`\`\`Unit test error 1\`\`\`
      \`\`\`{}\`\`\`"
    `);
  });

  it('should return error with functionNme, timestamp, logPrefix and error message', () => {
    expect(
      getErrorMessage({
        err: new Error('Unit test error 1'),
        logPrefix: 'log prefix 1',
        functionName: 'function name 1',
      }),
    ).toMatchInlineSnapshot(`
      "Error: 2021-12-15T12:00:00.000Z: \`log prefix 1\`: \`function name 1\`: 
      \`\`\`Unit test error 1\`\`\`
      \`\`\`{}\`\`\`"
    `);
  });

  it('should return error with eventId, functionName, timestamp, logPrefix and error message', () => {
    expect(
      getErrorMessage({
        err: new Error('Unit test error 1'),
        logPrefix: 'log prefix 1',
        functionName: 'function name 1',
        eventId: 'eventId 1',
      }),
    ).toMatchInlineSnapshot(`
      "Error: 2021-12-15T12:00:00.000Z: \`eventId 1\`: \`log prefix 1\`: \`function name 1\`: 
      \`\`\`Unit test error 1\`\`\`
      \`\`\`{}\`\`\`"
    `);
  });
});
