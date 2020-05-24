export function sort(values, algo){
    let res = {
        array: [],
        message: ""
    };
    let sorted = [];
    if(algo=="shell"){
        sorted = shell_sort(values,res);
    }
    if(algo=="selection"){
        sorted = selection(values,res);
    }
    if(algo=="insertion"){
        sorted = insertion(values,res);
    }
    let aux = [];
    for(let i=0;i<values.length;i++){
        aux.push(i);
    }
    res.array.push({
        type: "color",
        id: aux,
        color: "#afd8e5"
    });
    res.message = "ARREGLO ORDENADO#" + sorted.join(",");
    //console.log(res.array);
    //console.log(res.message)
    return res;
}

function shell_sort(values, res){
    //console.log(values.join(","));
    let ar = p_sort(values, res, 7);
    //console.log(ar.join(","));
    ar = p_sort(values, res, 3);
    //console.log(ar.join(","));
    ar = insertion(values,res);
    //console.log(ar.join(","));
    return ar;
}

function p_sort(values, res, gap){
    for(let i=0;i<gap;i++){
        let positions = [];
        //console.log("For "+i);
        for(let j=i;j<values.length;j=j+gap){
            positions.push(j);
        }
        //console.log("Positions "+positions.join(","));
        res.array.push({
            type: "color",
            id: positions,
            color: "#9d46ff"
        });
        for(let j=i+gap;j<values.length;j=j+gap){
            let id=j;
            while(id>=gap && values[id-gap]>values[id]){
                //Swap done
                let aux = values[id];
                values[id] = values[id-gap];
                values[id-gap] = aux;

                res.array.push({
                    type: "swap",
                    id1: id,
                    id2: id-gap
                });
                id = id-gap;
            }
        }
        //console.log(values.join(","))
        res.array.push({
            type: "color",
            id: positions,
            color: "#afd8e5"
        });
    }
    return values;
}

function insertion(nums,res){
    res.array.push({
        type: "color",
        id: [0],
        color: "#ffc246"
    });
    for (let i = 1; i < nums.length; i++) {
        res.array.push({
            type: "color",
            id: [i],
            color: "#ffc246"
        });
        let j = i - 1;
        while (j >= 0 && nums[j] > nums[j+1]) {
            let aux = nums[j+1];
            nums[j + 1] = nums[j];
            nums[j] = aux;
            res.array.push({
                type: "swap",
                id1: j,
                id2: j+1
            });
            j--;
            
        }
    }
    return nums;
}
function selection(arr,res) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        res.array.push({
            type: "color",
            id: [i],
            color: "#ffc246"
        });
        let min = i;
        let araux = [];
        for (let j = i + 1; j < len; j++) {
            araux.push(j);
            if (arr[min] > arr[j]) {
                if(min != i){
                    res.array.push({
                        type: "color",
                        id: [min],
                        color: "#4c8c4a"
                    });
                }
                res.array.push({
                    type: "color",
                    id: [j],
                    color: "#ff1744"
                });
                
                /*if(min == i){
                    res.array.push({
                        type: "color",
                        id: [j],
                        color: "#ff1744"
                    });
                }
                else{
                    res.array.push({
                        type: "color",
                        id: [min],
                        color: "afd8e5"
                    });
                    res.array.push({
                        type: "color",
                        id: [j],
                        color: "#ff1744"
                    });
                }*/
                min = j;
            }
            else{
                res.array.push({
                    type: "color",
                    id: [j],
                    color: "#4c8c4a"
                });
            }
        }
        if (min !== i) {
            let tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
            res.array.push({
                type: "swap",
                id1: i,
                id2: min
            });
            res.array.push({
                type: "color",
                id: [min],
                color: "#4c8c4a"
            })
        }
        res.array.push({
            type: "color",
            id: araux,
            color: "#afd8e5"
        });
    }
    return arr;
}