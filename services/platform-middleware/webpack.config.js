// TODO: remove webpack.config
const nodeExternals = require('webpack-node-externals');

/**
 *
 * @param {any} options
 * @returns
 */
module.exports = function (options) {
  return {
    ...options,
    externals: [
      nodeExternals({
        allowlist: ['p-retry'],
      }),
    ],
    output: {
      ...options.output,
      pathinfo: true,
    },
  };
};
