/**
 * @type {import('../../../serverless-typescript').ServerlessAwsFunctionConfig}
 */
const functionConfig = {
  handler: 'src/functions/check-solar-forecast/handler.handle',
};

module.exports = functionConfig;
