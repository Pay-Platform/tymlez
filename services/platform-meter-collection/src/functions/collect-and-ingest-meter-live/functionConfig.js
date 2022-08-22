/**
 * @type {import('../../../serverless-typescript').ServerlessAwsFunctionConfig}
 */
const functionConfig = {
  handler: 'src/functions/collect-and-ingest-meter-live/handler.handle',
};

module.exports = functionConfig;
