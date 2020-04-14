
export function myfunctionF(matrizAdya) {

    var min = -10;
    for (var i = 0; i < matrizAdya.length; i++) {
        if (min > matrizAdya[0][i]) {
            min = matrizAdya[0][i];
        }
    }
    var minValue = matrizAdya[0];
    for (var i = 1; i < matrizAdya[0].length; i++) {
        var currentValue = matrizAdya[0][i];
        if (currentValue < minValue) {
            minValue = currentValue;
        }
    }
    var maxValue = matrizAdya[0];
    for (var i = 1; i < matrizAdya[0].length; i++) {
        var currentValue = matrizAdya[0][i];
        if (currentValue > maxValue) {
            maxValue = currentValue;
        }
    }
    var data = new Array(1);
    data[0][0] = minValue;
    data[0][1] = maxValue;
    return data;
}


export function minimizacion(matrizAdya) {
    var min = [];
    // min.push(value);
    for (var j = 0; j < matrizAdya[0].length; j++) {
        var minn = matrizAdya[j][0];
        for (var i = 0; i < matrizAdya.length; i++) {
            if (minn > matrizAdya[i][j])
                minn = matrizAdya[i][j];
        }
        min.push(minn);
    }

    for (var j = 0; j < matrizAdya[0].length; j++) {
        for (var i = 0; i < matrizAdya.length; i++) {
            matrizAdya[i][j] = matrizAdya[i][j] - min[j];
        }
    }
    var min1 = [];
    for (var i = 0; i < matrizAdya.length; i++) {
        var minimo = matrizAdya[i][0];
        for (var j = 0; j < matrizAdya[0].length; j++) {
            if (minimo > matrizAdya[i][j])
                minimo = matrizAdya[i][j];
        }
        min1.push(minimo);
    }
    // console.table(min1);
    for (var i = 0; i < matrizAdya.length; i++) {
        for (var j = 0; j < matrizAdya[0].length; j++) {
            matrizAdya[i][j] = matrizAdya[i][j] - min1[i];
        }
    }
    return matrizAdya;
}
// var items = [
//   [1, 2, 4],
//   [3, 5, 7],
//   [9, 2, 6]
// ];

// console.table(minimizacion(items));