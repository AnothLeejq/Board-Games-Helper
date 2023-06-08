

//Game rule data
const gameSet:object[]=[];
gameSet.push({"player_num":5,"good":3,"quests":[2,3,2,3,3]});
gameSet.push({"player_num":6,"good":4,"quests":[2,3,4,3,4]});
gameSet.push({"player_num":7,"good":4,"quests":[2,3,3,4,4]});
gameSet.push({"player_num":8,"good":5,"quests":[3,4,4,5,5]});
gameSet.push({"player_num":9,"good":6,"quests":[3,4,4,5,5]});
gameSet.push({"player_num":10,"good":6,"quests":[3,4,4,5,5]});

let playerNum:number=5,questProgress:number[],questLeaderId:number,roleMerlinId:number;
let winSide:string,avalon_selectedSpcGroup:string[],leaderVoteTime:number;
let avalon_header:HTMLElement,avalon_GMscript:HTMLElement,avalon_characters:HTMLElement;
let avalon_spCharacters:object[]=[];
avalon_spCharacters.push({"name":"Percival","explaination":"Percival is on the side of Good. \nPercival's special power is knowledge of Merlin at the start of the game.\n*Note: for games of 5 players, you must add either Mordred or Morgana when playing with Percival."});
avalon_spCharacters.push({"name":"Mordred","explaination":"Mordred is on the side of Evil. \nHis special power is that his identity is not revealed to Merlin at the start of the game."});
avalon_spCharacters.push({"name":"Oberon","explaination":"Oberon is on the side of Evil. \nHis special power is that he does not reveal himself to the other evil players, nor does he gain knowledge of the other evil players at the start of the game.\nOberon is not a \"minion of mordred\" and does not open his eyes during the reveal at the start of the game."});
avalon_spCharacters.push({"name":"Morgana","explaination":"Morgana is on the side of evil. \nHer power is that she appears to be Merlin - revealing herself to Percival as Merlin."});
function avalon_showExplaination(name:string):void{
    let element:object = avalon_spCharacters[0];
    for(let i=0;i<avalon_spCharacters.length;i++){
        element = avalon_spCharacters[i];
        if(element["name"] === name){
            break;
        }
    }
    alert(element["explaination"]);
    return;
}

function avalon_reset():void{
    questProgress=[],winSide="",avalon_selectedSpcGroup=[];leaderVoteTime=0;questLeaderId=0;
    let playerNumInputHTML:string=`<p>Total players:<input id=\"playersNum\" type=\"number\" value=${playerNum} min=5 max=10></p>`;
    let characterInputHTML:string=`<p><form action=\"Werewolf.html\" id=\"spcSelect\"><fieldset><legend>Extra role</legend>`
    for(let i=0;i<avalon_spCharacters.length;i++){
        let element:object = avalon_spCharacters[i];
        let columnHTML:string = "";
        columnHTML = `<label><input type="checkbox" class="avalon_spc" id="spc_${element["name"]}" name="${element["name"]}" value="${element["name"]}"> ${element["name"]}</label><br>`;

        characterInputHTML += columnHTML;
    };
    characterInputHTML += "<input type=\"submit\" value=\"Done\"></fieldset></form></p>";
    avalon_GMscript.innerHTML=playerNumInputHTML;
    avalon_characters.innerHTML=characterInputHTML;
    avalon_header.innerHTML="";
    let spcSelect:HTMLElement|null = document.getElementById("spcSelect");
    spcSelect?.addEventListener('submit',(e)=>{
        e.preventDefault();
        let getSelectedSpcs:HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName('avalon_spc');
        for(let i=0;getSelectedSpcs[i];++i){
            if(getSelectedSpcs[i].checked){
                avalon_selectedSpcGroup.push(getSelectedSpcs[i].value);
            }
        }
        let playersNum:number = document.getElementById("playersNum")!.value;
        if(playersNum==5&&avalon_selectedSpcGroup.includes("Percival")&&!avalon_selectedSpcGroup.includes("Mordred")&&!avalon_selectedSpcGroup.includes("Morgana")){
            alert("You must add Mordred or Morgana if 5 players play with Percival!");
        }
        else{
            avalon_gameStart(playersNum);
        }
        

    });
}

function avalon_gameStart(players:number):void{
    avalon_header.innerHTML=`<p>Players: ${players}, there should be ${gameSet[players-5]["good"]} players from good side and ${players-gameSet[players-5]["good"]} players from evil side.<br>(Please prepare corresponding characters card and randomly give them to each players.)</p>`;
    let avalon_GMScriptHTML:string = `<p>(After everyone get their card, read those lines below without brackets)<br>
    Everyone close your eyes and extend your hand info a fist in front of you.<br>Minions of Mordred,${avalon_selectedSpcGroup.includes("Oberon")?" not Oberon,":""} open your eyes and look around so that you know all agents of Evil..<br>Minions of Mordred close your eyes..<br>All players should have their eyes closed and hands in a fist in front of them..<br>Minions of Mordred${avalon_selectedSpcGroup.includes("Mordred")?", not Mordred himself":""} - extend your thumb so that Merlin will know of you..<br>
    Merlin, open your eyes and see the agents of evil..<br>
    </p>`;
    avalon_GMscript.innerHTML=avalon_GMScriptHTML;
    avalon_characters.innerHTML=`<p>Player number of Merlin is <input type=number min=1 max=${players} id="merlin"></p>\
    <p><button onclick=\"avalon_startConfirmed()\">confirmed</button><br><br><button onclick=\"avalon_reset()\">Cancel</button></p>`;
    playerNum=players;
}

function avalon_startConfirmed():void{
    let MerlinNumber:number = document.getElementById("merlin")!.value;
    if(MerlinNumber==""||MerlinNumber===undefined||MerlinNumber===null){
        alert(`Merlin's player number should be a valid number (1 to ${playerNum})`);
    }
    else{
        roleMerlinId = MerlinNumber;
        let avalon_GMScriptHTML:string = `<p>(Read those lines below without brackets)<br>
        Minions of Mordred - put your thumbs down and re-form your hands into a fist.<br>
        Merlin, close your eyes..<br>
        ${avalon_selectedSpcGroup.includes("Percival")?`Merlin${avalon_selectedSpcGroup.includes("Morgana")?" and Morgana":""} - extend your tumb so that Percival may know of you.<br>
        Percival, open your eyes so you may know Merlin${avalon_selectedSpcGroup.includes("Morgana")?" and Morgana":""}.<br>
        Merlin${avalon_selectedSpcGroup.includes("Morgana")?" and Morgana":""} - put your thumbs down and form your hand info a fist..<br>
        Percival - close your eyes.<br>`:""}
        Everyone open your eyes..<br>
        </p>`;
        avalon_GMscript.innerHTML=avalon_GMScriptHTML;
        avalon_characters.innerHTML=`<p><button onclick=\"avalon_vote(0)\">next>></button></p>`;
    }
}

function avalon_vote(questNumber:number):void{
    leaderVoteTime+=1;
    if(questLeaderId<playerNum){questLeaderId+=1;}
    else{
        questLeaderId=1;
    }
    if(leaderVoteTime==6){avalon_gameOver("Evil","team vote got 5 rejections in single round");return;}
    let avalon_GMScriptHTML:string=`<p>Here comes quest ${questNumber+1}, <br>the leader will be Player No.${questLeaderId}. Team leader, please select ${gameSet[playerNum-5]["quests"][questNumber]} members to form your group for quest!</p>
    <p>(After Player No.${questLeaderId} made decision) Now everybody should vote for the decision of Player No.${questLeaderId}</p>`;

    avalon_GMscript.innerHTML=avalon_GMScriptHTML;
    let avalon_charactersHTML:string=`<p>Click <button onclick=\"avalon_quest(${questNumber})\">Approve</button> if more players voted for approve than reject.</p>
    <br>Otherwise, click <button onclick=\"avalon_vote(${questNumber})\">Reject</button></p>`;
    avalon_characters.innerHTML=avalon_charactersHTML;
    return;
}

function avalon_quest(questNumber:number):void{
    leaderVoteTime=0;
    let failureVote:number = ((questNumber==3)&&(playerNum>=7))?2:1;
    let avalon_GMScriptHTML:string=`<p>The team has been formed, team members please vote to determind the result of this quest!<br>Quest ${questNumber+1} fails if ${failureVote} failure vote(s) received.</p>`;
    let avalon_charactersHTML:string=`<p>(GM should collect votes from members, failure vote(s) received: <input type=number value=0 min=0 max=${Math.min(gameSet[playerNum-5]["quests"][questNumber],playerNum-gameSet[playerNum-5]["good"])} id="fail">)<br>
    <button onclick=\"avalon_run(${questNumber})\">Go!</button></p>`;
    avalon_GMscript.innerHTML=avalon_GMScriptHTML;
    avalon_characters.innerHTML=avalon_charactersHTML;
    return;
}

function avalon_run(questNumber:number):void{
    let failureVote:number = ((questNumber==3)&&(playerNum>=7))?2:1;
    let failure:number = document.getElementById("fail")!.value;
    if(failure>=failureVote){
        questProgress.push(2);
    }
    else{
        questProgress.push(1);
    }
    let headerHTML = `<p>Player: ${playerNum}(Good ${gameSet[playerNum-5]["good"]}/Evil ${playerNum-gameSet[playerNum-5]["good"]}) Merlin is Player No.${roleMerlinId}<br>Current quest: ${questNumber+1}</p>`;
    headerHTML+=`<br><fieldset><legend>Mission Status</legend>`;
    let sucessNum:number=0;
    for(let i=0;questProgress[i];++i){
        let progress:number=questProgress[i];
        headerHTML+=`<p>Misson ${i+1} ———————————— Result(${progress<2?"✔️":"❌"})</p>`;
        sucessNum+=progress<2?1:0;
    }
    headerHTML+=`<br></fieldset>`;
    avalon_header.innerHTML=headerHTML;
    let avalon_GMScriptHTML:string=`<p>Quest ended up with ${failure<failureVote?"success✔️":"fail❌"}</p>`;
    
    if(sucessNum>=3){
        avalon_GMScriptHTML+=`<p>Three quests completed! The good side is about to win!<br>However, evil side have their last chance. Assassin, now you can try to point out Merlin!<br>Assassin pointed out: <input type="number" min=1 max=${playerNum} id="merlin"></p>`;
        avalon_GMScriptHTML+=`<p><button onclick=\"avalon_assassin()\">Next>></button></p>`;
    }
    else if(questNumber+1-sucessNum>=3){
        avalon_gameOver("Evil","three quests failed");
    }
    else{
        avalon_GMScriptHTML+=`<p>Discussion ended. Go to next team vote<button onclick=\"avalon_vote(${questNumber+1})\">Next>></button></p>`
    }
    avalon_GMscript.innerHTML=avalon_GMScriptHTML;
    avalon_characters.innerHTML="";
}

function avalon_assassin():void{
    let target:number=document.getElementById("merlin")!.value;
    if(target==roleMerlinId){
        avalon_gameOver("Evil","assassin killed Merlin");
    }
    else{
        avalon_gameOver("Good","completed quests without exposing Merlin");
    }
}

function avalon_gameOver(winSide:string,reason:string="none"):void{
    let avalon_GMScriptHTML:string=`<p>${winSide} won for ${reason}!`;
    avalon_GMscript.innerHTML=avalon_GMScriptHTML;
    let avalon_charactersHTML:string=`<p>Click <button onclick=\"avalon_reset()\">Restart</button></p>`;
    avalon_characters.innerHTML=avalon_charactersHTML;
}

window.onload = function(){
    avalon_header = document.getElementById("header")!;
    avalon_GMscript = document.getElementById("gms")!;
    avalon_characters = document.getElementById("characters")!;
    avalon_reset();
    let spcsRefHTML:string="<p><fieldset><legend>References for Special Roles</legend>";
    for(let i=0;avalon_spCharacters[i];++i){
        spcsRefHTML+=`<button onclick="avalon_showExplaination(\'${avalon_spCharacters[i]["name"]}\')">What is ${avalon_spCharacters[i]["name"]}</button>         `;
    }
    spcsRefHTML+="</fieldset></p>";
    document.getElementById("charactersRef")!.innerHTML=spcsRefHTML;
}