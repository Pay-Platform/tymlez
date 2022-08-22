"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParameters = void 0;
const aws_sdk_1 = require("aws-sdk");
const ssm = new aws_sdk_1.SSM({ region: 'ap-southeast-2' });
async function getParameters(names) {
    const parameters = (await ssm
        .getParameters({
        Names: names,
        WithDecryption: true,
    })
        .promise()).Parameters;
    const parametersMap = parameters?.reduce((acc, parameter) => {
        if (parameter.Name) {
            acc[parameter.Name] = parameter;
        }
        return acc;
    }, {});
    return names.map((name) => parametersMap?.[name]?.Value);
}
exports.getParameters = getParameters;
//# sourceMappingURL=getParameters.js.map