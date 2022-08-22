/* eslint-disable no-template-curly-in-string */

const assert = require('assert');

const service = 'platform-meter-ingestion';

assert(process.env.ENV, `process.env.ENV is missing`);

const serverlessConfiguration = {
  service,
  frameworkVersion: '2',
  variablesResolutionMode: 20210326,

  provider: {
    name: 'google',
    // We don't need to supply `project` because we only use serverless framework
    // to package, and then use Terraform to deploy
    project: '',
    region: 'australia-southeast1',
    runtime: 'nodejs14',
    memorySize: 512,
    stage: process.env.ENV,
  },

  plugins: [
    'serverless-google-cloudfunctions', //
    'serverless-esbuild',
  ],

  custom: {
    esbuild: {
      packager: 'npm',
      bundle: true,
      minify: false,
      sourcemap: true,
      keepNames: true,
      external: ['pg-native'],
    },
  },
};

module.exports = serverlessConfiguration;
