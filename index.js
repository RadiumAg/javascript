let result = 0;
console.time();
setTimeout(() => {
  console.timeEnd();
});

for (let i = 0; i < 1000000000000000; i++) {
  result = result + Math.sqrt(result);
}
