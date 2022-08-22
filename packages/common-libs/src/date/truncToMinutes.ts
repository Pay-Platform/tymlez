import assert from 'assert';
import {
  roundToNearestMinutes,
  subMilliseconds,
  minutesToMilliseconds,
} from 'date-fns';

export function truncToMinutes(date: Date, boundary = 1) {
  assert(boundary > 0, `boundary is ${boundary}, expect larger than 0.`);
  assert(
    Number.isInteger(boundary),
    `boundary is ${boundary}, expect to be integer.`,
  );

  return roundToNearestMinutes(
    subMilliseconds(date, minutesToMilliseconds(boundary / 2)),
    { nearestTo: boundary },
  );
}
