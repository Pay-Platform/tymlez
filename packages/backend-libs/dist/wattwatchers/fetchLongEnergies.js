"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLongEnergies = void 0;
const common_libs_1 = require("@tymlez/common-libs");
const fetchLongEnergy_1 = require("./fetchLongEnergy");
async function fetchLongEnergies({ requests, }) {
    return (0, common_libs_1.runAllSettled)(requests, fetchLongEnergy_1.fetchLongEnergy);
}
exports.fetchLongEnergies = fetchLongEnergies;
//# sourceMappingURL=fetchLongEnergies.js.map