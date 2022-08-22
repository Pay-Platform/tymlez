export declare function sendMessage({ url, text, iconEmoji, }: {
    url: string;
    text: string;
    iconEmoji?: string;
}): Promise<import("@slack/webhook").IncomingWebhookResult>;
