import { spawnSync } from "child_process";

interface player{
    id:number,
    role:string,
    alive:boolean,
    side:string
}

function createPlayer(id:number,role:string,side:string):player{
    
    return{
        id:id,
        role:role,
        alive:true,
        side:side
    }
}

function resetPlayer(target:player,variableType:string,newValue:any):void{
    if(variableType==="role"){target.role=newValue;}
    if(variableType==="alive"){target.alive=newValue;
    if(newValue===false){
        //couple die together
        if(cupid_bind.includes(target)){cupid_bind[0].alive=false;cupid_bind[1].alive=false;cupid_bind=[];}
        //wild kid turn into werewolf
        if(round<=2&&wkid_example.includes(target)){resetPlayer(spcSelected["Wild Kid"],"side","werewolves");}
        //decrease the number of player of side
        if(target.side==="werewolves"||target.role==="Werewolf"||findSpCharacter({"outName":target.role,"target":"side"}) === "werewolves"){wolfNum-=1;}else{villagersNum-=1;}
        if(target.role==="Villager"){n_villagersNum-=1;}
            
        
    }}
    if(variableType==="side"){target.side=newValue;}
}

interface action{
    order:number,
    day:number,
    isDay:boolean,
    action_players:number[],
    action_type:string,
    action_target:number
}

interface gameLogs{
    id:number,
    playersNum:number,
    rule:number,
    spcSet:string[],
    logs:action[]
}

function createAction(order:number,action_players:number[],action_type:string,action_target:number):action{
    return {
        order:order,
        day:round,
        isDay:day,
        action_players:action_players,
        action_type:action_type,
        action_target:action_target
    }
}

function createGameLogs(spcSet:string[],logs:action[]):gameLogs{
    return {
        id:0,//temp
        playersNum:players.length,
        rule:ruleId,
        spcSet:spcSet,
        logs:logs
    }
}


//Prepare the game data

let wolfNum:number,villagersNum:number,n_villagersNum:number;
let ruleId:number;
let players:player[] = [];
const stageTexts:string[]=[];
stageTexts.push("Night is coming, everyone close your eyes...");
stageTexts.push("Werewolves, open your eyes. Confirm your teammates then choose a player who is going to die.");
stageTexts.push("Seer, open your eyes. Select a player who you are going to check tonight.");
stageTexts.push("Sun rises! Everyone, open up your eyes.")


//Basic character data
let werewolves:player[],villagers:player[];
let round:number=1,day:boolean=false;
let spcSelected:object = {},playersList:object = {};
let werewolves_target:player[]=[],werewolves_actioned:boolean=false,seer_target:number,seer_actioned:boolean;
//Spcs data
let hunter_id:player,hunter_able:boolean;
let wwking_id:player,wwking_able:boolean;
let witch_potions:object,witch_potion_target:number,witch_poison_target:number,witch_actioned:boolean=false;
let wkid_example:player[];
let cupid_bind:player[];
let guard_target:number,guard_actioned:boolean;
//System data
let lastWordCount:number=-1;let winSide:string="";


function reset(){
    //reset all the variables
    dayIcon.innerText= "";
    players =[],werewolves = [];villagers = [];spcSelected={};playersList={};cupid_bind=[];wkid_example=[];witch_potions = {"potion":1,"poison":1};hunter_able=true;winSide="";
    round=1,day=false;werewolves_target=[];seer_target=0;seer_actioned=false;werewolves_actioned=false;witch_actioned=false;guard_target=0;guard_actioned=false;lastWordCount=-1;
    wolfNum=0;villagersNum=0;n_villagersNum=0;
    let ruleZoneHTML:string="<p><form id=\"ruleSelect\"><fieldset><legend>Game Rule</legend>";

    for(let i=0;gameRules[i];++i){
        ruleZoneHTML+=`<input type="radio" value="${gameRules[i]["id"]}" name="rule" checked>${gameRules[i]["explaination"]}<br />`
    }
    ruleZoneHTML+="</fieldset></form></p>";
    document.getElementById("ruleZone")!.innerHTML=ruleZoneHTML;

    let charactersHTML:string = "<p>Total players:<input id=\"playersNum\" type=\"number\" value=5 min=5></p><p><form action=\"Werewolf.html\" id=\"spcSelect\"><fieldset><legend>Special role</legend>";

    for(let i=0;i<spCharacters.length;i++){
        let element:spCharacter = spCharacters[i];
        let columnHTML:string = "";
        if(element.side==="villagers"){
            columnHTML = `<label><input type="checkbox" class="spc" id="spc_${element.name}" name="${element.name}" value="${element.outName}"> ${element.outName}</label><br />`;
        }
        else{
            columnHTML = `<label><input type="checkbox" class="spw" id="spc_${element.name}" name="${element.name}" value="${element.outName}"> ${element.outName}</label><br />`;
        }

        charactersHTML += columnHTML;
    };
    charactersHTML += "<input type=\"submit\" value=\"Done\"></fieldset></form></p>";
    document.getElementById("characters")!.innerHTML = charactersHTML;
    let spcSelect:HTMLElement|null = document.getElementById("spcSelect");
    spcSelect?.addEventListener('submit',(e)=>{
        e.preventDefault();
        let getSelectedSpcs:HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName('spc');
        let checkedSpcs:string[] = [];
        for(let i=0;i<getSelectedSpcs.length;i++){
            let element = getSelectedSpcs[i];
            if(element.checked){
                checkedSpcs.push(element.value);
            }
        }
        let getSelectedSpws:HTMLCollectionOf<HTMLInputElement> = document.getElementsByClassName('spw');
        let checkedSpws:string[] = [];
        for(let i=0;i<getSelectedSpws.length;i++){
            let element = getSelectedSpws[i];
            if(element.checked){
                checkedSpws.push(element.value);
            }
            
        }
        let playersNum:number = document.getElementById("playersNum")!.value;
        let ruleApplied:string = document.querySelector('input[name="rule"]:checked')!.value;

        gameStart(ruleApplied,playersNum,checkedSpcs,checkedSpws);
        
    });
}

function getPlayersInfo(players):string{
    let charactersHTML="<table><tr><td>---No.---</td><td>---Role---</td><td>---Status---</td><td>---Side---</tr>";
    for(let i=0;players[i];++i){
        let player = players[i];
        charactersHTML+=`<tr><td>${player.id}</td><td>${player.role}</td><td>${(player.alive?(cupid_bind.includes(player)?"🥰":player.side==="werewolves"?"🐺":"😊"):"💀") +(werewolves_target.includes(player)?"🎯":"")+ (guard_target==player.id?"🛡️":"")+(witch_potion_target==player.id?"💊":(witch_poison_target==player.id?"☠️":""))+(seer_target==player.id?"🔍":"")}</td><td>${player.side}</td></tr>`;
    }
    charactersHTML += "</table>";
    return charactersHTML;
}

function gameStart(rule:string,playersNum:number,spcs:string[],spw:string[]){
    let stageHTML:string = `Please confirm players set for ${playersNum} players`;
    document.getElementById("stage")!.innerText=stageHTML;
    let ruleZoneHTML:string = "<p><fieldset><legend>Game Rule</legend>";
    switch(rule){
        case("r1"):{
            ruleZoneHTML += "Werewolves win when number of werewolves equals to Villagers left";
            ruleId=1;
            break;
        }
        case("r2"):{
            ruleZoneHTML += "Werewolves win when all villagers or all special characters belong to villagers' side killed";
            ruleId=2;
            break;
        }
        case("r3"):{
            ruleZoneHTML += "Werewolves win when all players belong to villagers' side killed";
            ruleId=3;
            break;
        }
        default:{
            ruleZoneHTML += "Werewolves win when number of werewolves equals to villagers left";
            ruleId=1;
        }
    }
    ruleZoneHTML+="</fieldset></p>";
    document.getElementById("ruleZone")!.innerHTML=ruleZoneHTML;
    let charactersHTML:string = "";
    //players list
    let notSelectedRoles:number[] = []
    for(let i=0;i<playersNum;i++){
        notSelectedRoles.push(i+1);
    }
    //Werewolves
    wolfNum = 1+Math.floor((playersNum-3)/4);
    villagersNum = playersNum - wolfNum;
    let n_werewolves:player[]=[];
    for(let i=0;i<wolfNum;i++){
        let randomInd = Math.floor(Math.random()*notSelectedRoles.length);
        let chosen:number = notSelectedRoles[randomInd];
        let newplayer:player = createPlayer(chosen,"Werewolf","werewolves");
        werewolves.push(newplayer);n_werewolves.push(newplayer);players.push(newplayer);playersList[newplayer.id]=newplayer;
        notSelectedRoles = notSelectedRoles.filter(function(e){return e!==chosen});
    }
    //Seer
    spcs.push('Seer');
    //other spcs & wolves
    for(let i=0;spcs[i];++i){
        let randomInd = Math.floor(Math.random()*notSelectedRoles.length);
        let chosen:number = notSelectedRoles[randomInd];
        let newplayer:player = createPlayer(chosen,spcs[i],"villagers");
        villagers.push(newplayer);
        players.push(newplayer);playersList[newplayer.id]=newplayer;
        spcSelected[spcs[i]]=newplayer;
        notSelectedRoles = notSelectedRoles.filter(function(e){return e!==chosen});
    }
    
    for(let i=0;spw[i];++i){
        let randomInd = Math.floor(Math.random()*n_werewolves.length);
        let chosen:player = n_werewolves[randomInd];
        resetPlayer(chosen,"role",spw[i]);
        spcSelected[spw[i]]=chosen;
        n_werewolves = n_werewolves.filter(function(e){return e!==chosen});
    }
    //normal villagers
    for(let i=0;notSelectedRoles[i];++i){
        let newplayer:player = createPlayer(notSelectedRoles[i],"Villager","villagers");playersList[newplayer.id]=newplayer;
        players.push(newplayer);
        villagers.push(newplayer);
        n_villagersNum+=1;
    }
    players.sort(function(a:player,b:player){return a.id-b.id});
    charactersHTML+=getPlayersInfo(players);
    
    charactersHTML+="<p><button onclick=\"startConfirmed()\">Let's get started!</button><br /><br /><button onclick=\"reset()\">Cancel</button></p>";
    document.getElementById("characters")!.innerHTML=charactersHTML;
    
}



function startConfirmed(){
    let stageHTML:string = "(Click \"next\" button below to start a game.)\nNow the night is coming, everyone close your eyes!";
    document.getElementById("stage")!.innerText=stageHTML;
    let charactersHTML:string = getPlayersInfo(players);
    charactersHTML+="<p><button onclick=\"next()\">Next>></button></p>";
    document.getElementById("characters")!.innerHTML=charactersHTML;
    dayIcon.innerText = `Day ${round} - 🌙`;
}

function next(stage:string=""){
    if(stage===""){
        //One-turn characters
        if("Cupid" in spcSelected&&round===1&&cupid_bind.length===0){
            next("CupidCheck");
            return;
        }
        if("Wild Kid" in spcSelected&&round===1&&wkid_example.length===0){
            next("WildKidCheck");
            return;
        }
        if(!werewolves_actioned){
            next("WerewolvesCheck");
            return;
        }
        if("Witch" in spcSelected&&!witch_actioned){
            next("WitchCheck1");
            return;
        }
        if("Guard" in spcSelected&&!guard_actioned){
            next("GuardCheck");
            return;
        }
        if(!seer_actioned){
            next("SeerCheck");
            return;
        }
        nightEnd();
        return;
    }
    else{
        let stageTexts:string="",charactersHTML:string=getPlayersInfo(players);
        //Cupid
        if(stage==="CupidCheck"){
            stageTexts="Open your eyes, Cupid. Please link two players whom you want to make to be couple.";
            charactersHTML+=`<p>Cupid(Player No.${spcSelected["Cupid"].id}) links <input id="cupid1" type="number" min=1 max=${players.length}> and <input id="cupid2" type="number" min=1 max=${players.length}></p>`;
            charactersHTML+=`<p><button onclick=\"next(\'Cupid\')\">Next>></button></p>`;
        }
        if(stage==="Cupid"){
            let cupidLink1:number=document.getElementById("cupid1")?.value;
            let cupidLink2:number=document.getElementById("cupid2")?.value;
            if(cupidLink1===""||cupidLink2===""||cupidLink1===null||cupidLink1===undefined||cupidLink2===null||cupidLink2===undefined){alert("You must input a valid number of both two players");next("CupidCheck");return;}
            if(cupidLink1==cupidLink2){alert("Can not link the same player");next("CupidCheck");return;}
            resetPlayer(spcSelected["Cupid"],"side","cupid");//Cupid is the third party.
            
            stageTexts=`(Cupid linked Player No.${cupidLink1} and No.${cupidLink2} together.) \n(GM need to wake up two players secrectly now) \nWake up couples, please confirm your couple.\nClose your eyes, Cupid.`;
            if(playersList[cupidLink1].side!==playersList[cupidLink2].side){
                
                if(playersList[cupidLink1].side!=="cupid"&&playersList[cupidLink2].side!=="cupid"){
                    resetPlayer(playersList[cupidLink1],"side","cupid");
                    resetPlayer(playersList[cupidLink2],"side","cupid");
                }
                else{
                    if(playersList[cupidLink1].side==="cupid"){resetPlayer(playersList[cupidLink1],"side",`cupid(${playersList[cupidLink2].side})`);}
                    if(playersList[cupidLink2].side==="cupid"){resetPlayer(playersList[cupidLink2],"side",`cupid(${playersList[cupidLink1].side})`);}
                }
            }
            cupid_bind=[playersList[cupidLink1],playersList[cupidLink2]];
            charactersHTML=getPlayersInfo(players);//User status updated here, need to update to the interface.
            charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;
        }

        //Wild Kid
        if(stage==="WildKidCheck"){
            stageTexts="Open your eyes, Wild Kid. Please select a player who you want to follow.";
            charactersHTML+=`<p>Wild Kid(Player No.${spcSelected["Wild Kid"].id}) decide to follow Player No.<input id="wkid" type="number" min=1 max=${players.length}></p>`;
            charactersHTML+=`<p><button onclick=\"next(\'WildKid\')\">Next>></button></p>`;
        }
        if(stage==="WildKid"){
            let wkExample:number=document.getElementById("wkid")?.value;
            if(wkExample===""||wkExample===null||wkExample===undefined){alert("You must input a valid number of a player");next("WildKidCheck");return;}
            if(wkExample==spcSelected["Wild Kid"].id){alert("Wild kid can not follow himself");next("WildKidCheck");return;}
            
            stageTexts=`(Wild Kid followed Player No.${wkExample} as "example".) \n(DO NOT wake up anyone else.) \nClose your eyes, wild kid.`;
            if(playersList[wkExample].side==="werewolves"||playersList[wkExample].role==="Werewolf"||findSpCharacter({"outName":playersList[wkExample].role,"target":"side"}) === "werewolves"){resetPlayer(spcSelected["Wild Kid"],"side","werewolves");}
            wkid_example=[playersList[wkExample]];
            charactersHTML=getPlayersInfo(players);//User status updated here, need to update to the interface.
            charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;
        }

        //Werewolves
        if(stage==="WerewolvesCheck"){
            stageTexts="Open your eyes, Werewolves.";
            if(round===1){
                stageTexts+="\nPlease confirm your teammates.";
            }
            stageTexts+="\nPlease select a player who you want to kill.";
            charactersHTML+=`<p>Werewolves pack decide to kill Player No.<input id="kill" type="number" min=1 max=${players.length}></p>`;
            charactersHTML+=`<p><button onclick=\"next(\'Werewolves\')\">Next>></button></p>`;
        }
        if(stage==="Werewolves"){
            let target:number=document.getElementById("kill")?.value;
            if(target===""||target===null||target===undefined||playersList[target].alive===false){alert("You must input a valid number of a living player");next("WerewolvesCheck");return;}
            stageTexts=`(Werewolves pack decide to kill Player No.${target}.) \nClose your eyes, werewolves.`;
            werewolves_target=[playersList[target]];
            charactersHTML=getPlayersInfo(players);//User status updated here, need to update to the interface.
            werewolves_actioned=true;
            charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;

        }

        //Witch
        if(stage==="WitchCheck1"){
            stageTexts="Open your eyes, Witch.";
            if(witch_potions["potion"]>0&&spcSelected["Witch"].alive){
                stageTexts+=`\nYou have a bottle of potion.\nAnd this player is dying tonight (No.${werewolves_target[0].id} ,GM should tell witch without making noise).\nAre you going to save?`;
                charactersHTML+=`<p><button onclick=\"next(\'Witch1\')\">Heal!</button><br /><button onclick=\"next(\'WitchCheck2\')\">No</button></p>`;
            }
            else{
                stageTexts+=`\nYou have a bottle of potion.\nAnd this player is dying tonight (Witch is unable to know this as she has no potion or dies).\nAre you going to save?\n\n(Yes, it's no use to say but GM should read these as normal or other players will know the status of witch.)`;
                charactersHTML+=`<p><button onclick=\"next(\'WitchCheck2\')\">Do not have potion or dies, next>></button></p>`;
            }
            
        }
        if(stage==="Witch1"){
            let target:player=werewolves_target[0];
            witch_potion_target = target.id;
            stageTexts=`(Witch healed Player No.${witch_potion_target}, so she can not use poison toight. But GM still need to read the sentence below as normal. Or other player will know the status of witch.) \nYou have a bottle of poison, who are you going to poison?\n(Wait for a while then say)\nClose your eyes please, witch.`;
            charactersHTML=getPlayersInfo(players);//User status updated here, need to update to the interface.
            charactersHTML+=`<p><button onclick=\"next()\">Can not use posion, next>></button></p>`;
            witch_actioned = true;
            witch_potions["potion"] =0;
        }
        if(stage==="WitchCheck2"){
            if(witch_potions["poison"]>0&&spcSelected["Witch"].alive){
                stageTexts="You have a bottle of poison, who are you going to poison?\n(GM should input 0 or leave blank if witch don't want to posion anyone tonight.)";
                charactersHTML+=`<p>Witch (Player No.${spcSelected["Witch"].id}) decide to poison Player No.<input id="poison" type="number" min=0 max=${players.length}></p>`;
                charactersHTML+=`<p><button onclick=\"next(\'Witch2\')\">Next>></button></p>`;
            }
            else{
                stageTexts="You have a bottle of poison, who are you going to poison?\n(Yes, witch has no posion or dies, however GM should still say this to prevent other players from knowing the status of witch.)";
                witch_actioned = true;
                charactersHTML+=`<p><button onclick=\"next()\">Do not have poison or dies, next>></button></p>`;
            }
        }
        if(stage==="Witch2"){
            let target:number=document.getElementById("poison")?.value;
            if(target==0||target===""||target===null||target===undefined||playersList[target].alive===false){
                stageTexts=`(Witch decided not to use posion tonight.)\nClose your eyes please, witch.`;
            }
            else{
                witch_poison_target = target;
                witch_potions["poison"] =0;
                charactersHTML=getPlayersInfo(players);//User status updated here, need to update to the interface.
                stageTexts=`(Witch decided to posion Player No.${target} tonight.)\nClose your eyes please, witch.`;
            }
            charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;
            witch_actioned = true;
        }

        //Guard
        if(stage==="GuardCheck"){
            stageTexts="Open your eyes, guard. Who are you going to protect?"
            if(spcSelected["Guard"].alive){
                if(round>1){
                    stageTexts+=`\n(Last night, guard protected Player No.${guard_target})`;
                }
                charactersHTML+=`<p>Guard (Player No.${spcSelected["Guard"].id}) decide to protect Player No.<input id="guard" type="number" min=1 max=${players.length}></p>`;
                charactersHTML+=`<p><button onclick=\"next(\'Guard\')\">Next>></button></p>`;
            }
            else{
                stageTexts+=`\n(Guard is dead, but GM need to say as if guard is alive.)\nClose your eyes please, guard.`;
                guard_target=0;
                guard_actioned=true;
                charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;
            }
        }
        if(stage==="Guard"){
            let target:number=document.getElementById("guard")?.value;
            if(target===""||target===null||target===undefined||playersList[target].alive===false){alert("Plase input a valid player number of a living player, guard must protect a player every night.");next("GuardCheck");return;}
            if(guard_target===target){alert("Can not protect same player in two nights.");next("GuardCheck");return;}
            guard_target=target;
            guard_actioned=true;
            charactersHTML=getPlayersInfo(players);//User status updated here, need to update to the interface.
            stageTexts=`(Guard decided to protect Player No.${target} tonight.)\nClose your eyes please, guard.`;
            charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;
        }
        
        //Seer
        if(stage==="SeerCheck"){
            stageTexts="Open your eyes, seer. Who are you going to check?"
            if(spcSelected["Seer"].alive){
                charactersHTML+=`<p>Seer (Player No.${spcSelected["Seer"].id}) decide to check Player No.<input id="seer" type="number" min=1 max=${players.length}></p>`;
                charactersHTML+=`<p><button onclick=\"next(\'Seer\')\">Next>></button></p>`;
            }
            else{
                seer_target=0;
                stageTexts+=`\n(Seer is dead, but GM need to say as if seer is alive.)\nThis player belongs to (Stop and do nothing for a while)\nIs that clear? Close your eyes please, seer.`;
                seer_actioned=true;
                charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;
            }
        }
        if(stage==="Seer"){
            let target:number=document.getElementById("seer")?.value;
            if(target===""||target===null||target===undefined||playersList[target].alive===false){alert("Plase input a valid player number of a living player, seer must check a player every night.");next("SeerCheck");return;}
            seer_target=target;
            charactersHTML=getPlayersInfo(players);//User status updated here, need to update to the interface.
            seer_actioned=true;
            stageTexts=`(Seer decided to check Player No.${target} tonight.) \nThis player belongs to ${playersList[target].side==="werewolves"||playersList[target].role==="Werewolf"||findSpCharacter({"outName":playersList[target].role,"target":"side"}) === "werewolves"?"(👎)":"(👍)"}\nIs that clear? Close your eyes please, seer.`;
            charactersHTML+=`<p><button onclick=\"next()\">Next>></button></p>`;
        }

        document.getElementById("characters")!.innerHTML=charactersHTML;
        document.getElementById("stage")!.innerText=stageTexts;

    }
}

function isGameEnd():boolean{
    wolfNum = 0;
    for(let i = 0;players[i];++i){
        let player:player = players[i];
        if(player.side==="werewolves"||player.role==="Werewolf"||findSpCharacter({"outName":player.role,"target":"side"}) === "werewolves"){if(player.alive){wolfNum+=1;}}            
    }
    
    if(cupid_bind.length>0){
        let cupidWin:boolean=true;
        for(let i=0;players[i];++i){
            if(players[i].side!=="cupid"&&players[i].alive){
                cupidWin=false;
                break;
            }
        }
        if(cupidWin){
            winSide="Cupid";
            return true;
        }
    }
    
    if(ruleId==1&&wolfNum>=villagersNum){
        winSide="Werewolves";
        return true;
    }
    if(ruleId==2&&(n_villagersNum==0)||(villagersNum-n_villagersNum==0)){
        winSide="Werewolves";
        return true;
    }
    if(ruleId==3&&villagersNum==0&&wolfNum>0){
        winSide="Werewolves";
        return true;
    }
    
    if(wolfNum==0){
        winSide="Villagers";
        return true;
    }
    return false;
}

function requestLog(){
    let logsText:string="---Game Logs---";
    return;
}


function dayEnd(){
    witch_potion_target = 0;
    witch_poison_target = 0;
    werewolves_target = [];
    seer_target = 0;
    day=false;
    if(guard_target>0){if(spcSelected["Guard"].alive===false){guard_target=0;}}
    let stageTexts:string="";
    let charactersHTML:string=getPlayersInfo(players);
    
    if(isGameEnd()){
        stageTexts=`Game over. ${winSide} win!`;
        charactersHTML+=`<p><button onclick="requestLog()">Request logs of this game</button></p>`;
        charactersHTML+=`<p><button onclick="reset()">Restart</button></p>`;
    }
    else{
        stageTexts="The night has come. Close your eyes, everyone!";
        charactersHTML+=`<p><button onclick="next()">Next>></button></p>`;
        round+=1;
    }
    dayIcon.innerText = `Day ${round} - 🌙`;
    
    document.getElementById("characters")!.innerHTML=charactersHTML;
    document.getElementById("stage")!.innerText=stageTexts;
    return;
}

function nightEnd(restart:string=""){
    let charactersHTML:string=getPlayersInfo(players);
    if(restart===""){
        day=true;
        dayIcon.innerText = `Day ${round} - ☀️`;
        werewolves_actioned=false;
        witch_actioned=false;seer_actioned=false;guard_actioned=false;
        let dyingPlayers:player[]=[];
        //Witch poison player
        if(witch_poison_target>0){dyingPlayers.push(playersList[witch_poison_target]);if(playersList[witch_poison_target].role==="Hunter"&&hunter_able){hunter_able=false;};}
        
        
        //saving judgements
        for(let i=0;werewolves_target[i];++i){
            if(witch_potion_target==werewolves_target[i].id){
                werewolves_target = werewolves_target.filter(function(e){return e!==werewolves_target[i]});
                continue;
            }
            if(guard_target==werewolves_target[i].id){
                werewolves_target = werewolves_target.filter(function(e){return e!==werewolves_target[i]});
                continue;
            }
            dyingPlayers.push(werewolves_target[i]);
        }
        
        //execute
        let hunter_die:boolean=false;
        let stageTexts:string="The night has gone. Open your eyes, everyone!";
        let dyingIds:number[] = [];
        for(let i=0;dyingPlayers[i];++i){
            
            
            let dead:player=dyingPlayers[i];
            resetPlayer(dead,"alive",false);
            
            //Death rattles from hunter
            if(dead.role==="Hunter"&&hunter_able){
                hunter_die=true;
            }
    
        }
        
        //List dead players number
        charactersHTML=getPlayersInfo(players);
        for(let i=0;players[i];++i){
            let dead:player=players[i];
            if(!dead.alive){dyingIds.push(dead.id);}
        }
        stageTexts+=dyingIds.length>0?`\nPlayer(s) with these number(s) didn't survive last night:${dyingIds}`:`\nLast night was peaceful, no one died.`;
        if(hunter_die){
            stageTexts+="\nA hunter died! Please select a player to bring with you to death.";
            charactersHTML+=`<p>Hunter is going to shoot Player No.<input id="hunter" type="number" min=1 max=${players.length}></p>`;
            charactersHTML+=`<button onclick="nightEnd(\'hunter\')">Hunter shoot</button></p>`;
            document.getElementById("stage")!.innerText=stageTexts;
            document.getElementById("characters")!.innerHTML=charactersHTML;
            return;
        }
        
        //System execute end, insert a judgement
        if(isGameEnd()){
            stageTexts=`Game over. ${winSide} win!`;
            charactersHTML+=`<p><button onclick="requestLog()">Request logs of this game</button></p>`;
            charactersHTML+=`<p><button onclick="reset()">Restart</button></p>`;
            document.getElementById("stage")!.innerText=stageTexts;
            document.getElementById("characters")!.innerHTML=charactersHTML;
            return;
        }
        //Game not end
        
        if("White Wolf King" in spcSelected&&spcSelected["White Wolf King"].alive){
            charactersHTML+=`<p>Fill in this blank and skip voting & last word when White Wolf King spelled his skill ➡️ Player No.<input id="wwking" type="number" min=1 max=${players.length}>`;
            charactersHTML+=`<button onclick="nightEnd(\'ww_explode\')">White Wolf Explode</button></p>`;
        }
        charactersHTML+=`<p>Fill in this blank and skip voting & last word when a normal werewolf explode ➡️ Player No. of the exploded werewolf:<input id="we" type="number" min=1 max=${players.length}>`;
        charactersHTML+=`<button onclick="nightEnd(\'w_explode\')">Wolf Explode</button></p>`;

        charactersHTML+=`<button onclick="nightEnd(\'vote\')">None of above, vote&last word>></button></p>`;
        document.getElementById("stage")!.innerText=stageTexts;
        document.getElementById("characters")!.innerHTML=charactersHTML;
        return;
    }
    else{
        if(restart==="w_explode"){
            let target:number = document.getElementById("we")?.value;
            if(target===""||target===undefined||target===null){alert("You must input a valid player number.");return;}
            if(playersList[target].alive===true&&(playersList[target].side==="werewolves"||playersList[target].role==="Werewolf"||findSpCharacter({"outName":playersList[target].role,"target":"side"}) === "werewolves")){
                resetPlayer(playersList[target],"alive",false);
                dayEnd();
                return;
            }else{alert("This is not a living werewolf.");return;}
        }
        if(restart==="ww_explode"){
            let target:number = document.getElementById("wwking")?.value;
            if(target===""||target===undefined||target===null){alert("You must input a valid player number.");return;};
            if(playersList[target].alive===true&&playersList[target].role!=="White Wolf King"){
                resetPlayer(playersList[target],"alive",false);
                resetPlayer(spcSelected["White Wolf King"],"alive",false);
                dayEnd();
                return;
            }else{alert("This is not a living player or this is White Wolf King himself.");return;};
        };
        if(restart==="hunter"){
            let target:number = document.getElementById("hunter")?.value;
            if(target===""||target===undefined||target===null){alert("You must input a valid player number.");return;};
            if(playersList[target].alive===true){
                resetPlayer(playersList[target],"alive",false);
                let stageTexts:string= `(Hunter shooted Player No.${target} to die with him.)`;
                hunter_able = false;
                charactersHTML = getPlayersInfo(players);
                charactersHTML += `<button onclick="nightEnd()">Okay, back>></button></p>`;
                document.getElementById("stage")!.innerText=stageTexts;
                document.getElementById("characters")!.innerHTML=charactersHTML;

            }else{alert("This is not a living player.");return;};
        };
        if(restart==="hunterX"){
            let target:number = document.getElementById("hunter")?.value;
            if(target===""||target===undefined||target===null){alert("You must input a valid player number.");return;};
            if(playersList[target].alive===true){
                resetPlayer(playersList[target],"alive",false);
                hunter_able = false;
                dayEnd();
                return;
            }else{alert("This is not a living player.");return;};
        };
        if(restart==="vote"){
            let stageTexts:string="Time for voting!";
            if(lastWordCount>0){
                lastWordCount-=1;
                stageTexts+=`\n${lastWordCount} days left for last words.`;
            }
            else if(lastWordCount<0){
                stageTexts += "\nDo not forget last words.";
            }
            else{
                stageTexts += "\nUnfortunately, no last word permitted.";
            }
            charactersHTML += `<p>Vote a player to execute ➡️ <input id="vote" type="number" min=1 max=${players.length}>`;
            charactersHTML += `<button onclick="nightEnd(\'voteEnd\')">Decided, next>></button></p>`;
            document.getElementById("stage")!.innerText = stageTexts;
            document.getElementById("characters")!.innerHTML = charactersHTML;
        };
        if(restart==="voteEnd"){
            let target:number = document.getElementById("vote")!.value;
            if(target===""||target===undefined||target===null){alert("You must input a valid player number.");return;};
            if(playersList[target].alive===true){
                day=false;
                resetPlayer(playersList[target],"alive",false);
                if(playersList[target].role==="Hunter"){
                    let stageTexts:string="A hunter was voted to die! Hunter, please select a player to bring with you to death.";
                    charactersHTML=getPlayersInfo(players);
                    charactersHTML+=`<p>Hunter is going to shoot Player No.<input id="hunter" type="number" min=1 max=${players.length}></p>`;
                    hunter_able = false;
                    charactersHTML+=`<button onclick="nightEnd(\'hunterX\')">Hunter shoot</button></p>`;
                    document.getElementById("stage")!.innerText = stageTexts;
                    document.getElementById("characters")!.innerHTML = charactersHTML;
                    return;
                }
                else{
                    dayEnd();
                    return;
                }
                
            }else{alert("This is not a living player.");return;};
        };
    };
    
    
    

}