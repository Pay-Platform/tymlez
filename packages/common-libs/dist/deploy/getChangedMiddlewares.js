"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedMiddlewares = void 0;
function getChangedMiddlewares(changedPackagesText) {
    const changedPackages = changedPackagesText
        ?.split(',')
        .map((pkg) => pkg.trim())
        .filter(Boolean);
    console.log('Changed Packages ', JSON.stringify(changedPackages, undefined, 2));
    return changedPackages?.filter((pkg) => pkg.endsWith('-middleware'));
}
exports.getChangedMiddlewares = getChangedMiddlewares;
//# sourceMappingURL=getChangedMiddlewares.js.map