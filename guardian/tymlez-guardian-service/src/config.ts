import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

const {
  SERVICE_CHANNEL,
  DB_HOST,
  PORT = 3010,
  MONGO_DB_CONNECTION = '',
  GUARDIAN_TYMLEZ_API_KEY = '',
  GUARDIAN_API_GW_URL = '',
  OPERATOR_ID,
} = process.env;

console.log('Starting tymlez-service', {
  now: new Date().toString(),
  BUILD_VERSION: process.env.BUILD_VERSION,
  DEPLOY_VERSION: process.env.DEPLOY_VERSION,
  PORT,
  DB_HOST,
  MONGO_DB_CONNECTION,
  OPERATOR_ID,
  GUARDIAN_API_GW_URL,
  SERVICE_CHANNEL,
});

assert(MONGO_DB_CONNECTION, `DB_DATABASE is missing`);
assert(GUARDIAN_API_GW_URL, `GUARDIAN_API_GW_URL is missing`);
assert(GUARDIAN_TYMLEZ_API_KEY, `GUARDIAN_TYMLEZ_API_KEY is missing`);

export {
  PORT,
  MONGO_DB_CONNECTION,
  GUARDIAN_API_GW_URL,
  GUARDIAN_TYMLEZ_API_KEY,
};
