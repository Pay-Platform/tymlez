import { sendMessage } from '.';

export async function trySendMessage(...args: Parameters<typeof sendMessage>) {
  try {
    return await sendMessage(...args);
  } catch (err) {
    console.warn('Failed to send message', args, err);
    return undefined;
  }
}
