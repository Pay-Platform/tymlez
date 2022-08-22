"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDuplicates = void 0;
const lodash_1 = require("lodash");
function hasDuplicates(items, iteratee) {
    return (0, lodash_1.uniqBy)(items, iteratee).length !== items.length;
}
exports.hasDuplicates = hasDuplicates;
//# sourceMappingURL=hasDuplicates.js.map