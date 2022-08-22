/**
 * @type {import('../../../serverless-typescript').ServerlessAwsFunctionConfig}
 */
const functionConfig = {
  handler: 'src/functions/ingest-cets-to-guardian/handler.handle',
};

module.exports = functionConfig;
