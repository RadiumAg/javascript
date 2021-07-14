/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
const checkInclusion = function (s1 = '', s2 = '') {
  let length = 0;
  // Array.from(s1).forEach((value, index) => {
  //     Array.from(s2).forEach((v, index) => {
  //         if (value === v) length++;
  //     });
  // });

  for (const value of s1) {
    for (const v of s2) {
      if (value === v) length++;
    }
  }
  if (length === s1.length) return true;
  else return false;
};
