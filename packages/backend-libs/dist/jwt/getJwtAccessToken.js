"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtAccessToken = void 0;
function getJwtAccessToken({ jwtService, user, }) {
    const info = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
        clientName: user.clientName,
    };
    if (user.roles.some((role) => role === 'permanent-display')) {
        return jwtService.sign(info, { expiresIn: '99y' });
    }
    return jwtService.sign(info);
}
exports.getJwtAccessToken = getJwtAccessToken;
//# sourceMappingURL=getJwtAccessToken.js.map