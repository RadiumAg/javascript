function BF(s: string, t: string, pos: number) {
  let i = pos,
    j = 0;
  const slen = s.length;
  const tlen = t.length;
  while (i < slen && j < tlen) {
    if (s[i] === t[j]) {
      i++;
      j++;
    } else {
      i = i - j + 1;
      j = 0;
    }
  }

  if (j >= tlen) return i - tlen + 1;
  else return 0;
}

console.log(BF('aaaaabbbbbb', 'ab', 0));
