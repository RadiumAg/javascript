function understandRecursion(doIunderstandRecursion) {
  const recursionAnswer = confirm('Do ypu understand recursion');

  if (recursionAnswer === true) {
    return true;
  }

  understandRecursion(recursionAnswer);
}

function factorialIteratvie(number) {
  if (number < 0) return undefined;
  let total = 1;

  for (let n = number; n > 1; n--) {
    total = total * n;
  }

  return total;
}
console.log(factorialIteratvie(5));
