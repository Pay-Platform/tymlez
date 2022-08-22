// cspell:ignore DDTHH
/**
 * Refer to https://en.wikipedia.org/wiki/ISO_8601
 * Refer https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 *
 * Spec: YYYY-MM-DDTHH:mm:ss.sssZ
 * Example: 2011-10-05T14:48:00.000Z
 * How to get it: `new Date().toISOString()`
 */
export type IIsoDate = string & {};
