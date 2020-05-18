function compet(nodes){
    let colors = ["#ff5131","#fd558f","#e254ff","#9d46ff","#7a7cff","#64c1ff","#62ebff","#5df2d6","#5efc82","#e4ff54","#ffdd4b","#ffff52"];
    let response = {
        message: "",
        array: [],
        color: []
    };
    //console.log(nodes[0].x);
    let id=0;
    while(is_different(nodes)){   
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
function is_different(a){
    let res = false;
    let px,py;
    if(a.length>0){
        px = a[0].x;
        py = a[0].y;
        for(let i=1;i<a.length;i++){
            let dx = Math.abs(a[i].x - px);
            let dy = Math.abs(a[i].y - py);
            if(dx>0.01 || dy>0.01){
                res = true;
            }
        }    
    }
    
    return res;
}