/**
 * Refer to https://dictionary.cambridge.org/dictionary/english/time-span
 *
 * A period of time (in seconds) within which something happens, or between two events.
 *
 * Example: 300 seconds = 5 minutes
 * How to get it: `(new Date() - new Date('2020-01-01')) / 1000`
 *
 */
export type ITimeSpanSec = number & {};
