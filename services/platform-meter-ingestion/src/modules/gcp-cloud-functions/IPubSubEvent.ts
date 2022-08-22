export type IPubSubEvent = {
  '@type': string;
  attributes?: {
    TIMESTAMP: string;
    METERID: string;
  };
  data?: string;
};
