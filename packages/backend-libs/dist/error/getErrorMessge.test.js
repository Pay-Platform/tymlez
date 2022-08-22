"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const getErrorMessage_1 = require("./getErrorMessage");
let clock;
beforeAll(() => {
    clock = fake_timers_1.default.install({
        shouldAdvanceTime: true,
        now: new Date('2021-12-15T12:00:00Z'),
    });
});
afterAll(() => {
    clock.uninstall();
});
describe('getErrorMessage', () => {
    it('should return error with timestamp, logPrefix and error message', () => {
        expect((0, getErrorMessage_1.getErrorMessage)({
            err: new Error('Unit test error 1'),
            logPrefix: 'log prefix 1',
        })).toMatchInlineSnapshot(`
      "Error: 2021-12-15T12:00:00.000Z: \`log prefix 1\`: 
      \`\`\`Unit test error 1\`\`\`
      \`\`\`{}\`\`\`"
    `);
    });
    it('should return error with functionNme, timestamp, logPrefix and error message', () => {
        expect((0, getErrorMessage_1.getErrorMessage)({
            err: new Error('Unit test error 1'),
            logPrefix: 'log prefix 1',
            functionName: 'function name 1',
        })).toMatchInlineSnapshot(`
      "Error: 2021-12-15T12:00:00.000Z: \`log prefix 1\`: \`function name 1\`: 
      \`\`\`Unit test error 1\`\`\`
      \`\`\`{}\`\`\`"
    `);
    });
    it('should return error with eventId, functionName, timestamp, logPrefix and error message', () => {
        expect((0, getErrorMessage_1.getErrorMessage)({
            err: new Error('Unit test error 1'),
            logPrefix: 'log prefix 1',
            functionName: 'function name 1',
            eventId: 'eventId 1',
        })).toMatchInlineSnapshot(`
      "Error: 2021-12-15T12:00:00.000Z: \`eventId 1\`: \`log prefix 1\`: \`function name 1\`: 
      \`\`\`Unit test error 1\`\`\`
      \`\`\`{}\`\`\`"
    `);
    });
});
//# sourceMappingURL=getErrorMessge.test.js.map