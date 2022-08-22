declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_NAME: string;
      ENV: string;
      GIT_SHA?: string;
      GIT_TAG?: string;
      METER_DB_HOST?: string;
      METER_DB_PORT?: string;
      METER_DB_DATABASE?: string;
      METER_DB_USERNAME?: string;
      METER_DB_PASSWORD?: string;
      METER_LIVE_PUBSUB_TOPIC?: string;
      GUARDIAN_TYMLEZ_SERVICE_BASE_URL?: string;
      GUARDIAN_TYMLEZ_SERVICE_API_KEY?: string;
    }
  }
}

export {};
