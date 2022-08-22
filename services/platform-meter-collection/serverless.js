const assert = require('assert');
const checkMeterEnergy = require('./src/functions/check-meter-energy/functionConfig');
const checkSolarForecast = require('./src/functions/check-solar-forecast/functionConfig');
const collectAndIngestMeterHistory = require('./src/functions/collect-and-ingest-meter-history/functionConfig');
const collectAndIngestMeterLive = require('./src/functions/collect-and-ingest-meter-live/functionConfig');
const ingestCetsToGuardian = require('./src/functions/ingest-cets-to-guardian/functionConfig');

const service = 'platform-meter-collection';

assert(process.env.ENV, 'process.env.ENV is missing');

/**
 * @type {import('@serverless/typescript').AWS}
 *
 */
const serverlessConfig = {
  service,
  frameworkVersion: '2',

  provider: {
    name: 'aws',
    region: 'ap-southeast-2',
    runtime: 'nodejs14.x',
    versionFunctions: false,
    memorySize: 512,
    stage: process.env.ENV,
    lambdaHashingVersion: '20201221',
  },

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
  plugins: ['serverless-esbuild'],

  functions: {
    checkMeterEnergy,
    checkSolarForecast,
    collectAndIngestMeterHistory,
    collectAndIngestMeterLive,
    ingestCetsToGuardian,
  },
};

if (serverlessConfig.functions) {
  Object.values(serverlessConfig.functions).forEach((func) => {
    assert(
      !func.handler?.startsWith('./'),
      `Function handler ${func.handler} startsWith './', which will break package individually.`,
    );
  });
}

module.exports = serverlessConfig;
