// Necessary to run JEST on a UTC timezone
// See https://stackoverflow.com/a/56482581
module.exports = async () => {
  process.env.TZ = 'UTC';
  process.env.MONGO_DB_CONNECTION = 'mongodb://localhost:27017/test';
  process.env.GUARDIAN_API_GW_URL = 'http://localhost:3000';
  process.env.GUARDIAN_TYMLEZ_API_KEY = 'test';
};
