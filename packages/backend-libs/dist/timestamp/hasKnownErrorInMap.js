"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasKnownErrorInMap = void 0;
function hasKnownErrorInMap({ id, item0, item1, knownErrorsMap, }) {
    const knownErrors = knownErrorsMap[id];
    return (!!knownErrors &&
        knownErrors.some((knownError) => knownError.item0.getTime() === item0.timestamp.getTime() &&
            knownError.item1.getTime() === item1.timestamp.getTime()));
}
exports.hasKnownErrorInMap = hasKnownErrorInMap;
//# sourceMappingURL=hasKnownErrorInMap.js.map