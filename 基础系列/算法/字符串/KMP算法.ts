function KMP(s: string, t: string, pos: number) {
  let i = pos,
    j = 0;
  let slen = 0;
  let tlen = 0;
  const next: number[] = [];
  slen = s.length;
  tlen = t.length;

  function get_next() {
    let j = 0,
      k = -1;
    next[0] = -1;
    while (j < tlen) {
      if (k === -1 || t[j] === t[k]) next[++j] = ++k;
      else k = next[k];
    }
  }

  get_next();

  while (i < slen && j < tlen) {
    if (j === -1 || s[i] === t[j]) i++, j++;
    else j = next[j];
  }

  if (j >= tlen) return i - tlen;
  else return -1;
}

console.log(KMP('abcbaba', 'aba', 0));
