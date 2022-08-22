/**
 * @type {import('../../../serverless-typescript').ServerlessAwsFunctionConfig}
 */
const functionConfig = {
  handler: 'src/functions/ingest-crufs-to-guardian/handler.handle',
};

module.exports = functionConfig;
