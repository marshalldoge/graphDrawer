export function MatrizFlex(matrizjohn,matrizad) {
    // Create one dimensional array 
    var gfg = new Array(matrizjohn.length);
      
    // Loop to create 2D array using 1D array 
    for (var i = 0; i < gfg.length; i++) { 
        gfg[i] = new Array(matrizjohn.length); 
    } 
      
    // Loop to initilize 2D array elements. 
    for (var i = 0; i < gfg.length; i++) { 
        for (var j = 0; j < gfg.length; j++) { 
                  //Si la matriz adyacencia tiene 0 en este campo copiar el 0 en la de flexibilidad
                  if(matrizad[i][j]==0){
                      gfg[i][j]=matrizad[i][j];
                  }else{
                      //Formula si existe un envio diferente de 0
                      gfg[i][j] = matrizjohn[j][2]-matrizjohn[i][1]-matrizad[i][j]; 
                  }
                  
          }
        }  
  return gfg;
}
