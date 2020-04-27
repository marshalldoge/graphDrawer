export function noroeste(matrizad, nodes, task){
    let colors = ["#800000","#FF0000","#FFA500","#808000","#800080","#FF00FF","#008000","#000080","#0000FF","#008080","#000000","#808080"];
    let response = {
        array: [],
        message: "",
    };
    let info = {
        sources: [],
        destinies: [],
        demand: [],
        disponibility: [],
        cost_matrix: []
    };
    let correctness = check_correctness(matrizad,nodes,info);
    if(correctness){
        /*
        console.log("SOURCES");
        console.log(info.sources.join(','));
        console.log("DESTINIES");
        console.log(info.destinies.join(','));
        console.log("DISPONIBILITY");
        console.log(info.disponibility.join(','));
        console.log("DEMAND");
        console.log(info.demand.join(','));
        console.log("Cost Matrix");
        console.log(info.cost_matrix.join("\n"));
        */
        //Solution
        //Precharge Solution
        let sol = [];
        for(let i=0;i<info.cost_matrix.length;i++){
            let aux = [];
            for(let j=0;j<info.cost_matrix[i].length;j++){
                aux.push(0);
            }
            sol.push(aux);
        }
        if(task == "max"){
            //Maximization
            while(sum(info.disponibility)>0 && sum(info.demand)>0){
                //Calculate penalities and identify the maximum penality
                //rows
                let max_penalty_row = -1;
                let id_penalty_row = -1;
                let aux = [];
                for(let i=0;i<info.cost_matrix.length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix[i].length;j++){
                        if(info.disponibility[i]!=0 && info.demand[j]!=0){
                            aux.push(info.cost_matrix[i][j]);
                        }
                        if(aux.length > 0){
                            let penalty_row = calc_penalty_max(aux);
                            if(penalty_row>max_penalty_row){
                                max_penalty_row = penalty_row;
                                id_penalty_row = i;
                            }
                        }
                    }
                }
                //cols
                let max_penalty_col = -1;
                let id_penalty_col = -1;
                aux = [];
                for(let i=0;i<info.cost_matrix[0].length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix.length;j++){
                        if(info.disponibility[j]!=0 && info.demand[i]!=0){
                            aux.push(info.cost_matrix[j][i]);
                        }
                        if(aux.length>0){
                            let penalty_col = calc_penalty_max(aux);
                            if(penalty_col>max_penalty_col){
                                max_penalty_col= penalty_col;
                                id_penalty_col = i;
                            }
                        }
                    }
                }
                //maximize penalty
                if(max_penalty_row >= max_penalty_col){
                    //search for row
                    let target = get_col_of_maximum_value_row(info.cost_matrix,id_penalty_row,info.disponibility,info.demand);
                    if(info.disponibility[id_penalty_row]>=info.demand[target]){
                        info.disponibility[id_penalty_row] -= info.demand[target];
                        sol[id_penalty_row][target] = info.demand[target];
                        info.demand[target] = 0;
                    }
                    else{
                        info.demand[target] -= info.disponibility[id_penalty_row];
                        sol[id_penalty_row][target] = info.disponibility[id_penalty_row];
                        info.disponibility[id_penalty_row] = 0;
                    }
                }
                else{
                    //search for 
                    let target = get_row_of_maximum_value_col(info.cost_matrix,id_penalty_col,info.disponibility,info.demand);
                    if(info.disponibility[target]>=info.demand[id_penalty_col]){
                        info.disponibility[target] -= info.demand[id_penalty_col];
                        sol[target][id_penalty_col] = info.demand[id_penalty_col];
                        info.demand[id_penalty_col] = 0;
                    }
                    else{
                        info.demand[id_penalty_col] -= info.disponibility[target];
                        sol[target][id_penalty_col] = info.disponibility[target];
                        info.disponibility[target] = 0;
                    }
                }
            }
            //console.log(sol.join("\n"));
        }
        else{
            //Minimization
            while(sum(info.disponibility)>0 && sum(info.demand)>0){
                //Calculate penalities and identify the maximum penality
                //rows
                let max_penalty_row = -1;
                let id_penalty_row = -1;
                let aux = [];
                for(let i=0;i<info.cost_matrix.length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix[i].length;j++){
                        if(info.disponibility[i]!=0 && info.demand[j]!=0){
                            aux.push(info.cost_matrix[i][j]);
                        }
                        if(aux.length > 0){
                            let penalty_row = calc_penalty_min(aux);
                            if(penalty_row>max_penalty_row){
                                max_penalty_row = penalty_row;
                                id_penalty_row = i;
                            }
                        }
                    }
                }
                //cols
                let max_penalty_col = -1;
                let id_penalty_col = -1;
                aux = [];
                for(let i=0;i<info.cost_matrix[0].length;i++){
                    aux = [];
                    for(let j=0;j<info.cost_matrix.length;j++){
                        if(info.disponibility[j]!=0 && info.demand[i]!=0){
                            aux.push(info.cost_matrix[j][i]);
                        }
                        if(aux.length>0){
                            let penalty_col = calc_penalty_min(aux);
                            if(penalty_col>max_penalty_col){
                                max_penalty_col= penalty_col;
                                id_penalty_col = i;
                            }
                        }
                    }
                }
                //maximize penalty
                if(max_penalty_row >= max_penalty_col){
                    //search for row
                    let target = get_col_of_minimum_value_row(info.cost_matrix,id_penalty_row,info.disponibility,info.demand);
                    if(info.disponibility[id_penalty_row]>=info.demand[target]){
                        info.disponibility[id_penalty_row] -= info.demand[target];
                        sol[id_penalty_row][target] = info.demand[target];
                        info.demand[target] = 0;
                    }
                    else{
                        info.demand[target] -= info.disponibility[id_penalty_row];
                        sol[id_penalty_row][target] = info.disponibility[id_penalty_row];
                        info.disponibility[id_penalty_row] = 0;
                    }
                }
                else{
                    //search for 
                    let target = get_row_of_minimum_value_col(info.cost_matrix,id_penalty_col,info.disponibility,info.demand);
                    if(info.disponibility[target]>=info.demand[id_penalty_col]){
                        info.disponibility[target] -= info.demand[id_penalty_col];
                        sol[target][id_penalty_col] = info.demand[id_penalty_col];
                        info.demand[id_penalty_col] = 0;
                    }
                    else{
                        info.demand[id_penalty_col] -= info.disponibility[target];
                        sol[target][id_penalty_col] = info.disponibility[target];
                        info.disponibility[target] = 0;
                    }
                }
            }
            //console.log(sol.join("\n"));
        }
        //Fill animation
        let total_cost = 0,color_id = 0;;
        for(let i=0;i<sol.length;i++){
            for(let j=0;j<sol[i].length;j++){
                if(sol[i][j]>0){
                    total_cost += (sol[i][j]*info.cost_matrix[i][j]);
                    let object = {
                        type: "edge",
                        source: info.sources[i],
                        target: info.destinies[j],
                        color: colors[color_id%12],
                        ro: sol[i][j]
                    };
                    response.array.push(object);
                    response.message = response.message + label_of(info.sources[i],nodes) + " envia " + sol[i][j].toString() + " unidades a "+ label_of(info.destinies[j],nodes)+ "#";
                    color_id += 1;
                }
            }
        }
        response.message = "El costo total es " + total_cost.toString() +"#" + response.message;
    }
    else{
        response.message = response.message + "La demanda no coincide con la disponibilidad";
    }
    //console.log(response.message);
    return response;
}
function label_of(target, nodes){
    let res;
    for(let i=0;i<nodes.length;i++){
        if(nodes[i].id == target){
            res = nodes[i].nodeInputModalName;
        }
    }
    return res;
}
function calc_penalty_max(lista){
    let res =0;
    if(lista.length>1){
        //1st iteration
        let pos,max_value1=-1;
        for(let i=0;i<lista.length;i++){
            if(lista[i]>max_value1){
                max_value1 = lista[i];
                pos = i;
            }
        }
        lista[pos] = -1;
        //2nd iteration
        let max_value2 = -1;
        for(let i=0;i<lista.length;i++){
            if(lista[i]>max_value2){
                max_value2 = lista[i];
            }
        }
        res = max_value1 - max_value2;
    }
    else{
        res = lista[0];
    }
    return res;

}
function calc_penalty_min(lista){
    let res =0;
    if(lista.length>1){
        //1st iteration
        let pos,min_value1=1000000000;
        for(let i=0;i<lista.length;i++){
            if(lista[i]<min_value1){
                min_value1 = lista[i];
                pos = i;
            }
        }
        lista[pos] = 1000000000;
        //2nd iteration
        let min_value2 = 1000000000;
        for(let i=0;i<lista.length;i++){
            if(lista[i]<min_value2){
                min_value2 = lista[i];
            }
        }
        res = min_value2 - min_value2;
    }
    else{
        res = lista[0];
    }
    return res;

}
function get_col_of_maximum_value_row(cost, row, disponibility, demand){
    let pos_max, max_val = -1;
    for(let i=0;i<cost[row].length;i++){
        if(disponibility[row]!=0 && demand[i]!=0){
            if(cost[row][i]>max_val){
                max_val = cost[row][i];
                pos_max = i;
            }
        }
    }
    return pos_max;
}
function get_row_of_maximum_value_col(cost, col, disponibility, demand){
    let pos_max, max_val = -1;
    for(let i=0;i<cost.length;i++){
        if(disponibility[i]!=0 && demand[col]!=0){
            if(cost[i][col]>max_val){
                max_val = cost[i][col];
                pos_max = i;
            }
        }
    }
    return pos_max;
}
function get_col_of_minimum_value_row(cost, row, disponibility, demand){
    let pos_max, min_val = 1000000000;
    for(let i=0;i<cost[row].length;i++){
        if(disponibility[row]!=0 && demand[i]!=0){
            if(cost[row][i]<min_val){
                min_val = cost[row][i];
                pos_max = i;
            }
        }
    }
    return pos_max;
}
function get_row_of_minimum_value_col(cost, col, disponibility, demand){
    let pos_max, min_val = 1000000000;
    for(let i=0;i<cost.length;i++){
        if(disponibility[i]!=0 && demand[col]!=0){
            if(cost[i][col]<min_val){
                min_val = cost[i][col];
                pos_max = i;
            }
        }
    }
    return pos_max;
}
function sum(lista){
    let sum = 0;
    for(let i=0;i<lista.length;i++){
        sum += lista[i];
    }
    return sum;
}
function check_correctness(matrizad, nodes, info){
    let total_demand = 0, total_disponibility = 0;
    let res = false;
    for(let i=0;i<nodes.length;i++){
        let current_node = nodes[i].id;
        let value_node = nodes[i].nodeInputModalValue;
        if(is_source(current_node, matrizad)){
            total_disponibility += value_node;
            info.sources.push(current_node);
            info.disponibility.push(value_node);
        }
        else{
            total_demand += value_node;
            info.destinies.push(current_node);
            info.demand.push(value_node);
        }
    }
    for(let i=0;i<info.sources.length;i++){
        let aux = [];
        for(let j=0;j<info.destinies.length;j++){
            aux.push(matrizad[info.sources[i]][info.destinies[j]]);
        }
        info.cost_matrix.push(aux);
    }
    if(total_demand == total_disponibility){
        res = true;
    }
    return res;
}
function is_source(id, matrizad){
    let res = true;
    for(let i=0;i<matrizad.length;i++){
        if(matrizad[i][id]!=0){
            res = false;
        }
    }
    return res;
}
