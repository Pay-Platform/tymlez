import { uniq } from 'lodash';

export function matchAll(regex: RegExp, text: string, limit = 100) {
  const matches: string[] = [];

  const newRegex = RegExp(
    regex.source,
    uniq([...regex.flags.split(''), 'g']).join(''),
  );

  let match: RegExpExecArray | null = null;
  let count = 0;
  do {
    match = newRegex.exec(text);
    if (match) {
      matches.push(match[0]);
    }

    if (count++ > limit) {
      throw new Error(
        `Failed to find all matches for '${newRegex}' in ${JSON.stringify(
          text.substring(0, 50),
        )} with limit of ${limit}`,
      );
    }
  } while (match);

  return matches;
}
