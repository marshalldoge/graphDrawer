    export function johnson(matrizad) {
        let array = new Array();
        //You can change this colors
        let FocusNodeColor = "#FAAC58";
        let FocusEdgeColor = "#F4FA58";
        let SelectNodeColor = "#819FF7"; //Only for start
        for(let i=0;i<matrizad.length;i++){//Column
        //Search Start Node and End Node
        //Choice the start node
        let start,end;
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
        //ANIMATION 
        let object = {
            type: "node",
            id: start,
            color: SelectNodeColor
        };
        array.push(object);
        object = {
            type: "node",
            id: end,
            color: SelectNodeColor
        }
        array.push(object);


        //JOHNSON CORE
        let matrizjohn = new Array();
        //Johnson algorithm using BFS
        //Queue Simulation with Array :v
        let queue = new Array();
        let ida = new Array(matrizad.length);
        let vuelta = new Array(matrizad.length);
        //Initialize ida and vuelta arrays
        for(let i=0;i<ida.length;i++){
            ida[i] = -1;
            vuelta[i] = -1;
        }
        //ida
        queue.push(start);
        //printAArray(queue);
        ida[start] = 0;
        //ANIMATION
        object = {
            type: "node",
            id: start,
            left: 0
        };
        array.push(object);
        //start bfs ida
        while(queue.length!=0){
            let node = queue.shift();
            //See conections of node
            for(let i=0;i<matrizad[node].length;i++){
                //if a conection between node and i exist
                if(matrizad[node][i]!=0){
                    queue.push(i);
                    if(ida[i]==-1){//No previous computation for node i
                        ida[i]=ida[node]+matrizad[node][i];
                        //ANIMATION
                       /* object = {
                            type: "node",
                            id: i,
                            left: ida[i]
                        };
                        array.push(object);*/
                    }
                    else{//previous computation exist
                        let newIda = ida[node]+matrizad[node][i];
                        if(newIda>ida[i]){
                            ida[i]=newIda;
                            //ANIMATION
                            /*object = {
                                type: "node",
                                id: i,
                                left: ida[i]
                            };
                            array.push(object);*/
                        }
                    }
                }
            }
        }
        //vuelta
        queue.push(end);
        vuelta[end]=ida[end];
        //ANIMATION
        object = {
            type: "node",
            id: end,
            right: vuelta[end]
        };
        array.push(object);
        //start bfs vuelta
        while(queue.length!=0){
            let node = queue.shift();
            //See conections to a node
            for(let i=0;i<matrizad[node].length;i++){
                //If a conection between node and i exist
                if(matrizad[i][node]!=0){
                    queue.push(i);
                    if(vuelta[i]==-1){//No previous computation for node i
                        vuelta[i]=vuelta[node]-matrizad[i][node];
                        //ANIMATION
                        /*object = {
                            type : "node",
                            id : i,
                            right : vuelta[i]
                        };
                        array.push(object)*/
                    }
                    else{//Previous computation exist
                        let newVuelta = vuelta[node]-matrizad[i][node];
                        if(newVuelta<vuelta[i]){
                            vuelta[i]=newVuelta;
                            //ANIMATION
                            /*object = {
                                type : "node",
                                id : i,
                                right : vuelta[i]
                            };
                            array.push(object)*/
                        }
                    }
                }
            }
        }
        for(let i=0;i<ida.length;i++){
            let newInfoNode = [ida[i],vuelta[i]];
            matrizjohn.push(newInfoNode);
            object = {
                type: "node",
                id: i,
                left: ida[i],
                right: vuelta[i]
            };
            array.push(object);
        }


        //Compute Flexibility
        // Create one dimensional array 
        let flexibilidad = new Array(matrizjohn.length);
        // Loop to create 2D array using 1D array 
        for (let i = 0; i < flexibilidad.length; i++) { 
            flexibilidad[i] = new Array(matrizjohn.length); 
        } 
        // Loop to initilize 2D array elements. 
        for (let i = 0; i < flexibilidad.length; i++) { 
            for (let j = 0; j <flexibilidad.length; j++) { 
                //Si la matriz adyacencia tiene 0 en este campo copiar el 0 en la de flexibilidad
                if(matrizad[i][j]==0){
                    flexibilidad[i][j]=0;
                }
                else{
                    //Formula si existe un envio diferente de 0
                    flexibilidad[i][j] = matrizjohn[j][1]-matrizjohn[i][0]-matrizad[i][j]; 
                    //ANIMATION RO AND CRITICAL PATH
                    object = {
                        type: "edge",
                        source: i,
                        target: j,
                        label: matrizad[i][j],
                        ro: flexibilidad[i][j],
                    };
                    array.push(object);
                    if(flexibilidad[i][j]==0){//FOR CRITICAL PATHs
                        object={
                            type: "node",
                            id: i,
                            color: FocusNodeColor
                        };
                        array.push(object);
                        object={
                            type: "edge",
                            source: i,
                            target: j,
                            color: FocusEdgeColor
                        };
                        array.push(object);
                        object={
                            type: "node",
                            id: j,
                            color: FocusNodeColor
                        };
                        array.push(object);
                    }    
                }      
            }
        }  
        return array;
    }
