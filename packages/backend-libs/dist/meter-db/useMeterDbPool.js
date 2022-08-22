"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMeterDbPool = void 0;
const getMeterDbPool_1 = require("./getMeterDbPool");
async function useMeterDbPool(callback, options = {}) {
    const pool = (0, getMeterDbPool_1.getMeterDbPool)(options);
    try {
        return await callback(pool);
    }
    finally {
        await pool.end();
    }
}
exports.useMeterDbPool = useMeterDbPool;
//# sourceMappingURL=useMeterDbPool.js.map