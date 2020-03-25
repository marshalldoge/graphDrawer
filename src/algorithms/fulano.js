
export function myfunctionF(matrizAdya) {

    var min = -10;
    var array = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
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
    data[0][0]= minValue;
    data[0][1]= maxValue;
    // let array = [{
    //     nodeId: 1,
    //     color: "#FFFFFF"
    // }, {
    //     nodeId: 2,
    //     color: "#FFFFFF"
    // }
    // ];
    return data;
}
