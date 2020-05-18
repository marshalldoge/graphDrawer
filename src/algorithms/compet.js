export function compet(nodes){
    let colors = ["#ff5131","#fd558f","#e254ff","#9d46ff","#7a7cff","#64c1ff","#62ebff","#5df2d6","#5efc82","#e4ff54","#ffdd4b","#ffff52"];
    let response = {
        message: "",
        array: [],
        color: []
    };
    let step = [];
    //console.log(nodes[0].x);
    let id=0;
    while(is_different(nodes, step)){
        step = [];
        for(let i=0;i<nodes.length;i++){
            step.push(nodes[i]);
        }   
        nodes = next_iteration(nodes);
        response.array.push(nodes);
        response.color.push(colors[id%12]);
        id = id + 1;
        //console.log(nodes);
    } 
    response.message = "SOLUCION#X=" + nodes[0].x + "#Y=" + nodes[0].y;
    //console.log("Final response");
    //console.log(response.message);
    console.log(response.color);
    return response;
}
function next_iteration(nodes){
    let res = [];
    let next;
    for(let i=0;i<nodes.length;i++){
        if(i==nodes.length-1){
            next = 0;
        }
        else{
            next = i + 1;
        }
        let xg = (nodes[i].x+nodes[next].x)/2;
        let yg = (nodes[i].y+nodes[next].y)/2;
        xg = Number(xg.toFixed(4));
        yg = Number(yg.toFixed(4));
        let object = {
            x: xg,
            y: yg,
        };
        res.push(object);
    }
    return res;
}
function is_different(a, b){
    let res = false;
    if(a.length != b.length){
        res = true;
    }
    else{
        for(let i=0;i<a.length;i++){
            if(a[i].x != b[i].x){
                res = true;
            }
            if(a[i].y != b[i].y){
                res = true;
            }
        }
    }
    return res;
}