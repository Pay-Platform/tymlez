/**
 * @type {import('../../../serverless-typescript').ServerlessAwsFunctionConfig}
 */
const functionConfig = {
  handler: 'src/functions/collect-and-ingest-meter-history/handler.handle',
};

module.exports = functionConfig;
