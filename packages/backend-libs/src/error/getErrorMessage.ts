import { safeJsonStringify } from '@tymlez/common-libs';

export function getErrorMessage({
  err,
  logPrefix,
  eventId,
  functionName,
}: {
  err: unknown;
  logPrefix: string;
  eventId?: string;
  functionName?: string;
}) {
  let errorMessage = `Error: ${new Date().toISOString()}: `;

  if (eventId) {
    errorMessage += `\`${eventId}\`: `;
  }

  errorMessage += `\`${logPrefix}\`: `;

  if (functionName) {
    errorMessage += `\`${functionName}\`: `;
  }

  errorMessage += `\n\`\`\`${
    err instanceof Error ? err.message : 'Unknown error'
  }\`\`\`\n\`\`\`${safeJsonStringify(err)}\`\`\``;

  return errorMessage;
}
