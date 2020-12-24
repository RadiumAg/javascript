function shellSort(array = []) {
    let gap = array.length % 2 !== 0 ? (array.length - 1) / 2 : array.length / 2;
    for (let i = 1; gap >= i; gap = gap / 2) {
        for (let j = gap; j < array.length; j++) {
            if (array[j] > array[j + gap]) {
                let temp = array[j];
                array[j] = array[j + gap];
                array[j + gap] = temp;
            }
        }
        console.log(array);
    };
}

let a = [7, 6, 9, 3, 1, 5, 2, 4];
shellSort(a);
console.log(a);




