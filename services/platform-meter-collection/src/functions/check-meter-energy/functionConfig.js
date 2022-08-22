/**
 * @type {import('../../../serverless-typescript').ServerlessAwsFunctionConfig}
 */
const functionConfig = {
  handler: 'src/functions/check-meter-energy/handler.handle',
};

module.exports = functionConfig;
