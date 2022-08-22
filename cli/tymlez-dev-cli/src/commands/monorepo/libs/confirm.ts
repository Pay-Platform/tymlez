// eslint-disable-next-line import/no-import-module-exports
import readline from 'readline';
/**
 *
 * @param {string} query
 * @returns {Promise<string>}
 */
export function confirm(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    }),
  );
}

module.exports = { confirm };
