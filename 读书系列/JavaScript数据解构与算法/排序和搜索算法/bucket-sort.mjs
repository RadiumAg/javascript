function bucketSort(array, bucketSize = 5) {
  if (array.length < 2) return array;
}

function createBuckets(array, bucketSize) {
  let minValue = array[0];
  let maxValue = array[0];

  for (let i = 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i];
    } else if (array[i] > maxValue) {
      maxValue = array[i];
    }
  }

  const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
  const buckets = [];

  for (let i = 0; i < bucketCount; i++) {
    buckets[i] = [];
  }

  for (const element of array) {
    const index = array.indexOf(element);
    const bucketIndex = Math.floor((element - minValue) / bucketSize);
    buckets[bucketIndex].push(array[index]);
  }

  return buckets;
}
