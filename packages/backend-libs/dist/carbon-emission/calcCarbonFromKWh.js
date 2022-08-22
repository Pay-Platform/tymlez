"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcCarbonFromKWh = void 0;
function calcCarbonFromKWh({ energyKWh, factor, }) {
    return (energyKWh / 1000) * factor;
}
exports.calcCarbonFromKWh = calcCarbonFromKWh;
//# sourceMappingURL=calcCarbonFromKWh.js.map