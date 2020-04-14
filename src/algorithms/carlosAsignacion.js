export function cadenaSol(matriz) {
        
    var cerosporfila=new Array(matriz.length);
    var cerosporcol=new Array(matriz.length);
    var ceros=0;
    //cerear vectores
     for(var x = 0; x < cerosporfila.length; x++){
       cerosporfila[x]=0;
       cerosporcol[x]=0;
     }

     //cantidad de ceros por fila y col
    for (var i = 0; i < matriz.length; i++) { 
      for (var j = 0; j < matriz.length; j++) { 
                if(matriz[i][j]==0){
                 cerosporfila[i]++;
                 cerosporcol[j]++;
                 ceros++; 
                }
        }
      }  
 
      //det si no hay solucion
      for(var y = 0; y < cerosporfila.length; y++){
        if(cerosporfila[y]==0 || cerosporcol[y]==0){
          return null;
        }
      }

      //filas y columnas de ceros en un vector
      var aux=new Array(ceros);
      var it=0;
      var aux2=new Array(2);
      for (var i = 0; i < matriz.length; i++) { 
        for (var j = 0; j < matriz.length; j++) { 
                  if(matriz[i][j]==0){
                   aux2[0]=i;
                   aux2[1]=j;
                    aux[it]=aux2;
                    it++;
                  }
          }
        }

      var posta=0;
      var aux10=new Array(1);
      var comp;
      var j=0;
      var noexiste;
      while (posta<aux.length){
        aux10=new Array(1);
        aux10[0]=aux[0];
        
          while (j < aux.length) { 
                    if(posta!=j){
                      comp=aux[j];

                      noexiste=true;
                      var comp2;
        for(var i=0;i<aux.length ; i++){
        comp2=aux[i];
        if(comp[0]==comp2[0] || comp[1]==comp==2){
        noexiste= false;
        } 

        }
                      if(noexiste){
                        aux10.push(comp);
                      }
                      
                      
                    }
                    if(aux10.length==matriz.length){
                      return aux10;
                    }
                    j++;
                    if(j==aux.length){
                      posta++;
                      j==0;
                    }
            }

       
      }

  return null;
    }