
export function myfunctionF(matrizAdya) {

    let min = -10;
    for (let i = 0; i < matrizAdya.length; i++) {
        if (min > matrizAdya[0][i]) {
            min = matrizAdya[0][i];
        }
    }
    let minValue = matrizAdya[0];
    for (let i = 1; i < matrizAdya[0].length; i++) {
        let currentValue = matrizAdya[0][i];
        if (currentValue < minValue) {
            minValue = currentValue;
        }
    }
    let maxValue = matrizAdya[0];
    for (let i = 1; i < matrizAdya[0].length; i++) {
        let currentValue = matrizAdya[0][i];
        if (currentValue > maxValue) {
            maxValue = currentValue;
        }
    }
    let data = new Array(1);
    data[0][0] = minValue;
    data[0][1] = maxValue;
    return data;
}


export function minimizacion(matrizAdya) {
    let min = [];
    // min.push(value);
    for (let j = 0; j < matrizAdya[0].length; j++) {
        let minn = matrizAdya[j][0];
        for (let i = 0; i < matrizAdya.length; i++) {
            if (minn > matrizAdya[i][j])
                minn = matrizAdya[i][j];
        }
        min.push(minn);
    }

    for (let j = 0; j < matrizAdya[0].length; j++) {
        for (let i = 0; i < matrizAdya.length; i++) {
            matrizAdya[i][j] = matrizAdya[i][j] - min[j];
        }
    }
    let min1 = [];
    for (let i = 0; i < matrizAdya.length; i++) {
        let minimo = matrizAdya[i][0];
        for (let j = 0; j < matrizAdya[0].length; j++) {
            if (minimo > matrizAdya[i][j])
                minimo = matrizAdya[i][j];
        }
        min1.push(minimo);
    }
    // console.table(min1);
    for (let i = 0; i < matrizAdya.length; i++) {
        for (let j = 0; j < matrizAdya[0].length; j++) {
            matrizAdya[i][j] = matrizAdya[i][j] - min1[i];
        }
    }
    return matrizAdya;
}
// let items = [
//   [1, 2, 4],
//   [3, 5, 7],
//   [9, 2, 6]
// ];

// console.table(minimizacion(items));
export function selectionSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let min = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[min] > arr[j]) {
                min = j;
            }
        }
        if (min !== i) {
            let tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
        }
    }
    return arr;
}