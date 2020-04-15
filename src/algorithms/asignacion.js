//matrixad is Adjacency Matrix

//task is a string "max" for maximization "min" for minimization
let permutations = []
export function asignacion(matrixad, task){ 
    let colors = ["#ff5131","#fd558f","#e254ff","#9d46ff","#7a7cff","#64c1ff","#62ebff","#5df2d6","#5efc82","#e4ff54","#ffdd4b","#ffff52"];
    let response = {
        array: [],
        message: "",
    }

    let info = {
        sources: [],
        destinies: []
    };
    let matrix = correctMatrix(matrixad,info);
    if(info.sources.length>=info.destinies.length){
        permute(info.sources,0,info.sources.length-1);
        let resultCost;
        let solution;
        if(task == "max"){
            resultCost = -1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.destinies.length;j++){
                    iterationCost += matrixad[permutations[i][j]][info.destinies[j]];
                    if(matrixad[permutations[i][j]][info.destinies[j]]==0){
                        iterationCost -= 1000000;
                    }
                }
                if(iterationCost > resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            //console.log(resultCost);
            //console.log(solution.join(','));
            response.message = response.message.concat("El costo maximo es ",resultCost," ");
        }
        if(task == "min"){
            resultCost = 1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.destinies.length;j++){
                    iterationCost += matrixad[permutations[i][j]][info.destinies[j]];
                    if(matrixad[permutations[i][j]][info.destinies[j]]==0){
                        iterationCost += 1000000;
                    }
                }
                if(iterationCost < resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            //console.log(resultCost);
            //console.log(solution.join(','));
            response.message = response.message.concat("El costo minimo es ",resultCost," ");
        }
        for(let i=0;i<info.destinies.length;i++){
            response.message = response.message.concat("El nodo ",solution[i]," es asignado a ",info.destinies[i]," ");
            let object1 = {
                type: "node",
                id: solution[i],
                color: colors[i]
            };
            let object2 = {
                type: "edge",
                source: solution[i],
                target: info.destinies[i],
                color: colors[i]
            };
            let object3 = {
                type: "node",
                id: info.destinies[i],
                color: colors[i]
            };
            response.array.push(object1);
            response.array.push(object2);
            response.array.push(object3);
        }
    }
    else{
        let resultCost;
        let solution;
        permute(info.destinies,0,info.destinies.length-1);
        if(task == "max"){
            resultCost = -1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.sources.length;j++){
                    iterationCost += matrixad[info.sources[j]][permutations[i][j]];
                    if(matrixad[info.sources[j]][permutations[i][j]] == 0){
                        iterationCost -= 1000000;
                    }
                }
                if(iterationCost > resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            //console.log(resultCost);
           // console.log(solution.join(','));
            response.message = response.message.concat("El costo maximo es ",resultCost," ");
        }
        if(task == "min"){
            resultCost = 1000000;
            for(let i=0;i<permutations.length;i++){
                let iterationCost = 0;
                for(let j=0;j<info.sources.length;j++){
                    iterationCost += matrixad[info.sources[j]][permutations[i][j]];
                    if(matrixad[info.sources[j]][permutations[i][j]] == 0){
                        iterationCost += 1000000;
                    }
                }
                if(iterationCost < resultCost){ 
                    resultCost = iterationCost;
                    solution = permutations[i];
                }
            }
            //console.log(resultCost);
            //console.log(solution.join(','));
            response.message = response.message.concat("El costo minimo es ",resultCost," ");
        }
        for(let i=0;i<info.sources.length;i++){
            response.message = response.message.concat("El nodo ",info.sources[i]," es asignado a ",solution[i]," ");
            let object1 = {
                type: "node",
                id: info.sources[i],
                color: colors[i]
            };
            let object2 = {
                type: "edge",
                source: info.sources[i],
                target: solution[i],
                color: colors[i]
            };
            let object3 = {
                type: "node",
                id: solution[i],
                color: colors[i]
            };
            response.array.push(object1);
            response.array.push(object2);
            response.array.push(object3);
        }
    }
    //console.log(response.message);
    //console.log(response.array);
    return response;
}
function swap (alphabets, index1, index2) {
    let temp = alphabets[index1];
    alphabets[index1] = alphabets[index2];
    alphabets[index2] = temp;
    return alphabets;
  }
  
function permute (alphabets, startIndex, endIndex) {
    let aux = [];
    if (startIndex === endIndex) {
        for(let i=0;i<alphabets.length;i++){
            //console.log(alphabets[i]);
            aux.push(alphabets[i]);
        }
        //console.log(aux);
        permutations.push(aux);
    } else {
      for (let i = startIndex; i <= endIndex; i++) {
        alphabets = swap(alphabets, startIndex, i);
        permute(alphabets, startIndex + 1, endIndex);
        alphabets = swap(alphabets, i, startIndex);
      }
    }
  }


//This function convert a simple Adjacency Matrix into a Matrix with only sources and destinies
function correctMatrix(matrixad, info){
    let sources = [];
    let destinies = [];
    //Search for destinies
    for(let i=0;i<matrixad.length;i++){
        let isDestiny = true;
        for(let j=0;j<matrixad.length;j++){
            if(matrixad[i][j]!=0){
                isDestiny = false;
            }
        }
        if(isDestiny){
            destinies.push(i);
        }
    }
    info.destinies = destinies;
    //Search for destinies
    for(let i=0;i<matrixad.length;i++){
        let isSource = true;
        for(let j=0;j<matrixad.length;j++){
            if(matrixad[j][i]!=0){
                isSource = false;
            }
        }
        if(isSource){
            sources.push(i);
        }
    }
    info.sources = sources;
    //Complete a new Matrix
    let newMatrix = [];
    for(let i=0;i<sources.length;i++){
        let newRow = [];
        for(let j=0;j<destinies.length;j++){
            newRow.push(matrixad[sources[i]][destinies[j]]);
        }
        newMatrix.push(newRow);
    }
    return newMatrix;
}