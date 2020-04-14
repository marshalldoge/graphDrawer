function maximizacion(matrizAdya) {
    var max = [];
    for (var j = 0; j < matrizAdya[0].length; j++) {
        var maxx = matrizAdya[j][0];
        for (var i = 0; i < matrizAdya.length; i++) {
            if (maxx < matrizAdya[i][j])
                maxx = matrizAdya[i][j];
        }
        max.push(maxx);
    }

    for (var j = 0; j < matrizAdya[0].length; j++) {
        for (var i = 0; i < matrizAdya.length; i++) {
            matrizAdya[i][j] = matrizAdya[i][j] - max[j];
        }
    }
    var max1 = [];
    for (var i = 0; i < matrizAdya.length; i++) {
        var maximo = matrizAdya[i][0];
        for (var j = 0; j < matrizAdya[0].length; j++) {
            if (maximo < matrizAdya[i][j])
                maximo = matrizAdya[i][j];
        }
        max1.push(maximo);
    }
    // console.table(min1);
    for (var i = 0; i < matrizAdya.length; i++) {
        for (var j = 0; j < matrizAdya[0].length; j++) {
            matrizAdya[i][j] = matrizAdya[i][j] - max1[i];
        }
    }
    return matrizAdya;
}
 var items = [
  [1, 2, 4],
  [3, 5, 7],
  [9, 2, 6]
];

console.table(minimizacion(items));
