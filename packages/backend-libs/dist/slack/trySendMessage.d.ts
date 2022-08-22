import { sendMessage } from '.';
export declare function trySendMessage(...args: Parameters<typeof sendMessage>): Promise<import("@slack/webhook").IncomingWebhookResult | undefined>;
