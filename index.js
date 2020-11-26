const a = [1, 2, 3, 4],
  b = [1, 2, 3, 4],
  c = new Set(),
  d = [];

for (let item of [...a,...b]) {
   c.add(item);
}

c.forEach((x)=>{
  d.push(x);
})




