"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readStreamAsync = void 0;
function readStreamAsync(stream, encoding = 'utf8') {
    stream.setEncoding(encoding);
    return new Promise((resolve, reject) => {
        let data = '';
        stream.on('data', (chunk) => {
            data += chunk;
        });
        stream.on('end', () => resolve(data));
        stream.on('error', (error) => reject(error));
    });
}
exports.readStreamAsync = readStreamAsync;
//# sourceMappingURL=readStreamAsync.js.map