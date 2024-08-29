function radixSort(array, radixBase = 10) {
  if (array.length < 2) return array;

  const minValue = findMinValue(array);
  const maxValue = findMaxValue(array);

  let significantDigit = 1;

  while ((maxValue - minValue) / significantDigit >= 1) {
    array = countingSortForRadix(array, radixBase, significantDigit, minValue);
    significantDigit *= radixBase;
  }
}

function countingSortForRadix(array, radixBase, significantDigit, minValue) {
  let bucketsIndex;
  const buckets = [];
  const aux = [];

  for (const element of array) {
    bucketsIndex = Math.floor(
      ((element - minValue) / significantDigit) % radixBase,
    );
    aux[--buckets[bucketsIndex]] = element;
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = aux[i];
  }
  return array;
}

function findMaxValue(array) {
  let max = array[0];
  for (const item of array) {
    if (item > max) {
      max = item;
    }
  }
  return max;
}

function findMinValue(array) {
  let min = array[0];
  for (const item of array) {
    if (item < min) {
      min = item;
    }
  }
  return min;
}
