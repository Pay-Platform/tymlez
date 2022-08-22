"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeHasKnownErrorInMeterOrCarbon = void 0;
const _1 = require(".");
const constants_1 = require("./constants");
const hasKnownErrorInMap_1 = require("./hasKnownErrorInMap");
const makeHasKnownErrorInMeterOrCarbon = ({ knownMeterErrorsMap = constants_1.KNOWN_WATTWATCHERS_ERRORS_MAP, knownCarbonErrorsMap = _1.KNOWN_CARBON_EMISSION_ERRORS_MAP, } = {}) => ({ item0, item1, }) => {
    if ((0, hasKnownErrorInMap_1.hasKnownErrorInMap)({
        id: item0.meterId,
        item0,
        item1,
        knownErrorsMap: knownMeterErrorsMap,
    })) {
        return true;
    }
    if ((0, hasKnownErrorInMap_1.hasKnownErrorInMap)({
        id: item0.region,
        item0,
        item1,
        knownErrorsMap: knownCarbonErrorsMap,
    })) {
        return true;
    }
    return false;
};
exports.makeHasKnownErrorInMeterOrCarbon = makeHasKnownErrorInMeterOrCarbon;
//# sourceMappingURL=makeHasKnownErrorInMeterOrCarbon.js.map