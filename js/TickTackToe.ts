//Game data
let ttt_gridHTML:HTMLElement,ttt_confirmHTML:HTMLElement,ttt_settingHTML:HTMLElement,ttt_currentPHTML:HTMLElement;
let started:boolean,turn:number,currentP:number,cSize:number=3,cTarget:number=3;
let ttt_grids:grid[][],label:string[]=["O","X"],pre_label:string[]=["(O)","(X)"];
let ttt_currentHolding:number[];
let ttt_moves:number;
interface grid{
    x:number,
    y:number,
    current:string
}

function ttt_gameStart(size:number){
    started=true;
    cSize=size;
    initG(size);
    cTarget=document.getElementById("target")!.value;
    let settingHTML=`<p>Size: ${cSize}</p>`;
    settingHTML+=`<p>The first player links ${cTarget} cells wins!</p>`;
    ttt_moves=0;
    ttt_settingHTML.innerHTML=settingHTML;
    ttt_currentHolding=[-1,-1];
    let confirmHTML=`<p><button class="buttonconfirm" onclick="ttt_move()">confirm</button></p>`;
    ttt_confirmHTML.innerHTML=confirmHTML;
    let currentHTML=`<p>Current player: ${label[currentP]}</p>`;
    ttt_currentPHTML.innerHTML=currentHTML;
    return;
}

function ttt_move(){
    if(ttt_currentHolding[0]<0){alert("You have not selected a move,\nplease select your move by clicking the board.");return;}
    cS(ttt_currentHolding[0],ttt_currentHolding[1],label[currentP]);
    ttt_currentHolding=[-1,-1];
    ttt_moves+=1;
    currentP=1-currentP;//switch side
    let currentHTML=`<p>Current player: ${label[currentP]}</p>`;
    ttt_currentPHTML.innerHTML=currentHTML;
    initG(cSize);
    let result:string=ttt_end();
    if(result!==""){
        ttt_gameEnd(`Player ${result} won.`);
    }
    else if(ttt_moves>=cSize*cSize){
        ttt_gameEnd(`Draw.`);
    }
}

function ttt_gameEnd(statement:string):void{
    let currentHTML=`<p>${statement}</p>`;
    ttt_currentPHTML.innerHTML=currentHTML;
    let confirmHTML=`<p><button class="buttonconfirm" onclick="ttt_reset(${cSize},${cTarget})">restart</button></p>`;
    ttt_confirmHTML.innerHTML=confirmHTML;
}


function ttt_end():string{
    let result:string="";//2 stand for nobody wins yet.
    for(let i=0;i<cSize;i++){
        for(let j=0;j<cSize;j++){
            if(label.includes(ttt_grids[i][j].current)){
                let fm:number[]=[i,j];
                let cMark:string=ttt_grids[i][j].current;
                if(ttt_link(fm,[i-1,j+1],1,cMark)||ttt_link(fm,[i,j+1],1,cMark)||ttt_link(fm,[i+1,j+1],1,cMark)||ttt_link(fm,[i+1,j],1,cMark)){result=cMark;break;}
            }
        }
    }
    return result;
}

function ttt_link(from:number[],to:number[],len:number,player:string):boolean{
    
    if(len>=cTarget){return true;}
    let fx=from[0],fy=from[1],tx=to[0],ty=to[1];
    let dx=tx-fx,dy=ty-fy;
    if(tx<0||tx>cSize-1||ty>cSize-1){return false;}//out of side
    else if(ttt_grids[tx][ty].current!==player){return false;}//do not belong to current player
    
    
    if(dx<0){
        return ttt_link([tx,ty],[tx-1,ty+1],len+1,player);//up & right
    }else if(dx>0){
        if(dy==0){
            return ttt_link([tx,ty],[tx+1,ty],len+1,player);//down
        }
        else{
            return ttt_link([tx,ty],[tx+1,ty+1],len+1,player);//down & right
        }
    }
    else{
        return ttt_link([tx,ty],[tx,ty+1],len+1,player);//right
    }

}

function ttt_reset(size:number=3,target:number=3):void{
    started=false,turn=0,currentP=0;ttt_grids=[];
    
    let min:boolean=false,max:boolean=false;
    if(size==3){min=true;}
    if(size==10){max=true;}
    let settingHTML=`<p>Size: ${size} 【${min?"":`<button onclick=\"ttt_reset(${size-1},${size-1})\">-</button>`}  ${max?"":`<button onclick="ttt_reset(${size+1},${size+1})">+</button>`}】</p>`;
    settingHTML+=`<p>Target:<input id="target" type="number" min=3 max=${size} value=${target}></p>`;
    let confirmHTML=`<p><button class="buttonconfirm" onclick="ttt_gameStart(${size})">confirm</button></p>`;
    ttt_settingHTML.innerHTML=settingHTML;
    ttt_confirmHTML.innerHTML=confirmHTML;
    ttt_currentPHTML.innerHTML="";
    initG(size);
}

function createGrid(x:number,y:number):grid{
    return{
        x:x,
        y:y,
        current:"blank"
    };
}

function cS(x:number,y:number,newStatus:string):void{
    //alert(`x=${x},y=${y},newStatus=${newStatus}`);
    let target:grid=ttt_grids[x][y];
    if(pre_label.includes(newStatus)){if(ttt_currentHolding[0]>0){cS(ttt_currentHolding[0],ttt_currentHolding[1],"blank");}ttt_currentHolding=[x,y];}
    target.current=newStatus;
    initG(cSize);
    return;
}

function initG(size:number):void{
    if(!started){ttt_grids=[];}//Reset for preview
    let gridHTML=`<p><table>`;
    for(let i=0;i<size;i++){
        gridHTML+=`<tr>`
        if(!started){ttt_grids.push([]);}
        for(let j=0;j<size;j++){
            gridHTML+=`<td>${started?(ttt_grids[i][j].current==="blank"?`<button class="buttonNoBorder" onclick="cS(${i},${j},'${pre_label[currentP]}')">   </button>`:ttt_grids[i][j].current):" "}</td>`;
            if(!started){ttt_grids[i].push(createGrid(i,j));}
        }
        gridHTML+=`</tr>`;
    }
    gridHTML+=`</table></p>`;
    ttt_gridHTML.innerHTML=gridHTML;
}


window.onload=function(){
    ttt_gridHTML=document.getElementById("grid")!;
    ttt_confirmHTML=document.getElementById("confirm")!;
    ttt_settingHTML=document.getElementById("setting")!;
    ttt_currentPHTML=document.getElementById("current")!;
    ttt_reset();
}