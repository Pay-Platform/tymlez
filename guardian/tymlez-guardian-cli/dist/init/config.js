"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const console_1 = require("console");
const prefix = (name, uppercase = false, overrides = {}) => {
    (0, console_1.assert)(process.env.CLIENT_NAME, 'Missing CLIENT_NAME in environment variables');
    if (process.env.CLIENT_NAME?.toLocaleLowerCase() === 'uon') {
        const prefixText = overrides.uon || 'Uon';
        return (uppercase ? prefixText.toUpperCase() : prefixText) + name;
    }
    const prefixText = overrides.tymlez || overrides.default || 'Tymlez';
    return (uppercase ? prefixText.toUpperCase() : prefixText) + name;
};
const config = () => {
    return {
        installerSchemaName: prefix('Installer'),
        deviceSchemaName: prefix('Device', false, {
            uon: 'Uon',
            default: 'Tymlez',
        }),
        withPrefix: (name) => {
            return prefix(name, false, {
                uon: 'Uon',
                default: 'Tymlez',
            });
        },
    };
};
exports.config = config;
//# sourceMappingURL=config.js.map