"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const deploy_1 = require("../deploy");
const loadEnv_1 = require("../loadEnv");
const init_1 = require("../init");
const heml_1 = require("../deploy/heml");
async function main() {
    const rootYargs = (0, yargs_1.default)(process.argv.slice(2));
    await rootYargs
        .command('helm', 'Deploy with helm', {
        ddKey: {
            type: 'string',
            description: 'Datadog API Key',
            required: false
        },
        apiKey: {
            type: 'string',
            description: 'Tymlez API Key',
            required: false
        },
        dryRun: {
            type: 'boolean',
            description: 'Only dry-run',
            required: false,
            default: true
        },
        gcpProjectId: {
            type: 'string',
            required: false
        },
        imageTag: {
            type: 'string',
            required: false
        },
        clientName: {
            type: 'string',
            required: false
        }
    }, heml_1.runHelmDeploy)
        .command('deploy', 'Deploy', {}, deploy_1.deploy)
        .command('load-env', 'Load environment variables', {}, loadEnv_1.loadEnv)
        .command('init', 'Initialize Guardian', {}, init_1.init)
        .command('decode-schemas', 'Decode schemas', {}, init_1.decodeSchemas)
        .demandCommand()
        .strict()
        .help().argv;
}
main().catch((err) => {
    console.error('Failed to execute', err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map