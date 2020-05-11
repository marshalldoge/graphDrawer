export function trees(nodes, task){
    let colorFocus = "#ff5131";
    let colorDone = "#e254ff";
    let arbol = buildTree(nodes);
    let response = {
        array: [],
        message: ""
    };
    //console.log(arbol.join(","));

    if(task=="in"){
        response.message = "INORDER#";
        inorder(1, arbol, response, colorFocus, colorDone);
    }
    if(task=="pre"){
        response.message = "PREORDER#";
        preorder(1, arbol,response, colorFocus, colorDone);
    }
    if(task=="post"){
        response.message = "POSTORDER#";
        postorder(1, arbol, response, colorFocus, colorDone);
    }
    let aux = "";
    for(let i=0;i<response.message.length-1;i++){
        aux = aux + response.message[i];
    }
    response.message = aux;
    console.log(response.message);
    for(let i=0;i<response.array.length;i++){
        console.log(response.array[i]);
    }
    return response;
}
function inorder(pos, arbol, response,colorFocus, colorDone){
    if(arbol[pos]==-1){
        return;
    }
    response.array.push({
        node: arbol[pos],
        color: colorFocus
    });
    inorder(pos*2,arbol, response, colorFocus, colorDone);
    response.array.push({
        node: arbol[pos],
        color: colorDone
    })
    response.message =response.message + arbol[pos] + ",";
    inorder((pos*2)+1,arbol, response, colorFocus, colorDone); 
    return;
}
function preorder(pos, arbol, response, colorFocus, colorDone){
    if(arbol[pos]==-1){
        return;
    }
    response.array.push({
        node: arbol[pos],
        color: colorDone
    })
    response.message =response.message + arbol[pos] + ",";
    preorder(pos*2,arbol, response, colorFocus, colorDone);
    preorder((pos*2)+1,arbol, response, colorFocus, colorDone); 
    return;
}
function postorder(pos, arbol, response, colorFocus, colorDone){
    if(arbol[pos]==-1){
        return;
    }
    response.array.push({
        node: arbol[pos],
        color: colorFocus
    })
    postorder(pos*2, arbol, response, colorFocus, colorDone);
    postorder((pos*2)+1, arbol, response, colorFocus, colorDone);
    response.array.push({
        node: arbol[pos],
        color: colorDone
    })
    response.message =response.message + arbol[pos] + ",";
    return;

}
function buildTree(nodes){
    let arbol = [];
    for(let i=0;i<1000000;i++){
        arbol.push(-1);
    }
    let pos;
    for(let i=0;i<nodes.length;i++){
        pos = 1;
        while(arbol[pos]!=-1){
            if(nodes[i]<arbol[pos]){
                pos=pos*2;
            }
            else{
                if(nodes[i]>arbol[pos]){
                    pos=(pos*2)+1;
                }
                else{
                    if(arbol[pos]==nodes[i]){
                        break;
                    }
                }
            }
        }
        arbol[pos]=nodes[i];
    }

    return arbol;
}