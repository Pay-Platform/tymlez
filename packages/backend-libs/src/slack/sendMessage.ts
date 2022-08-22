import { IncomingWebhook } from '@slack/webhook';

export async function sendMessage({
  url,
  text,
  iconEmoji,
}: {
  url: string;
  text: string;
  iconEmoji?: string;
}) {
  const webhook = new IncomingWebhook(url);

  return await webhook.send({
    text,
    icon_emoji: iconEmoji,
  });
}
