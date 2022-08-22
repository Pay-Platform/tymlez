"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAll = void 0;
const lodash_1 = require("lodash");
function matchAll(regex, text, limit = 100) {
    const matches = [];
    const newRegex = RegExp(regex.source, (0, lodash_1.uniq)([...regex.flags.split(''), 'g']).join(''));
    let match = null;
    let count = 0;
    do {
        match = newRegex.exec(text);
        if (match) {
            matches.push(match[0]);
        }
        if (count++ > limit) {
            throw new Error(`Failed to find all matches for '${newRegex}' in ${JSON.stringify(text.substring(0, 50))} with limit of ${limit}`);
        }
    } while (match);
    return matches;
}
exports.matchAll = matchAll;
//# sourceMappingURL=matchAll.js.map