const path = require('path');
const withTM = require('next-transpile-modules')([
  // Uncomment this if you're using Fullcalendar features
  // '@fullcalendar/common',
  // '@fullcalendar/react',
  // '@fullcalendar/daygrid',
  // '@fullcalendar/list',
  // '@fullcalendar/timegrid',
  // '@fullcalendar/timeline',
  '@tymlez/common-libs',
  '@tymlez/devias-material-kit',
]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    loader: 'custom',
  },
  /**
   *
   * @param {any} webpackConfig
   * @returns
   */
  webpack(webpackConfig) {
    webpackConfig.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: { plugins: [{ removeViewBox: false }] },
          },
        },
      ],
    });

    return {
      ...webpackConfig,
      resolve: {
        ...webpackConfig.resolve,
        // symlinks: false,
        modules: [
          path.resolve('./node_modules'),
          'node_modules',
          path.resolve('./'),
        ],
      },
    };
  },
  eslint: {
    // We run eslint separately in CI
    ignoreDuringBuilds: true,
  },
});
