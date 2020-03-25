export function johnson(matrizad) {
    let array = new Array();
    //You can change this colors
    let FocusNodeColor = "#FAAC58";
    let FocusEdgeColor = "#F4FA58";
    let SelectNodeColor = "#819FF7"; //Only for start
    //Search Start Node and End Node
    //Choice the start node
    let start,end;
    for(let i=0;i<matrizad.length;i++){//Column
        let onlyZeros = true;
            for(let j=0;j<matrizad.length;j++){//Row
                if(matrizad[j][i]!=0){
                    onlyZeros = false;
                }
            }
        if(onlyZeros){
            start = i;
        }
    } 
    //Choice end node 
    for(let i=0;i<matrizad.length;i++){//Row
        let onlyZeros = true;
            for(let j=0;j<matrizad.length;j++){//Column
                if(matrizad[i][j]!=0){
                    onlyZeros = false;
                }
            }
        if(onlyZeros){
            end = i;
        }
    }
    let object = {
        type: "node",
        id: start,
        color: SelectNodeColor
    }
    array.push(object);
    object = {
        type: "node",
        id: end,
        color: SelectNodeColor
    }
    array.push(object);
	return array;
}
