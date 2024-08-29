import { defaultEquals } from '../util.mjs';

const DOES_NOT_EXIST = -1;

function sequentialSearch(array, value, equalsFn = defaultEquals) {
  for (const [i, element] of array.entries()) {
    if (equalsFn(value, element)) {
      return i;
    }
  }

  return DOES_NOT_EXIST;
}
