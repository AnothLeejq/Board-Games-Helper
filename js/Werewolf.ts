interface spCharacter{
    name:string,
    outName:string,
    explaination:string,
    selected:boolean
    side:string
}

function createCharacter(name:string,outName:string,explaination:string,side:string):spCharacter{
    return {
        name:name,
        outName:outName,
        explaination:explaination,
        selected:false,
        side:side
    }
}



//Prepare the variables needed
const spCharacters:spCharacter[] = [];
let dayIcon:HTMLElement;
//Game rules
const gameRules:object[] = [];
gameRules.push({"id":"r1","explaination":"Rule 1 [Werewolves win when number of werewolves equals to Villagers left]"});
gameRules.push({"id":"r2","explaination":"Rule 2 [Werewolves win when all Villagers or all Special characters belong to villagers'side killed]"});
gameRules.push({"id":"r3","explaination":"Rule 3 [Werewolves win when all players belong to villagers' side killed]"});

//Add spChar info here
spCharacters.push(createCharacter("witch","Witch","Witch belongs to villagers.\nWitch holds a bottle of potion and poison, which make her can poison AND save a player from being killed once per game.\nWitch can not use two bottles in one night.","villagers"));
spCharacters.push(createCharacter("hunter","Hunter","Hunter belongs to villagers.\nHunter doesn't spell his skill until he dies. However, once the hunter dies he must select a living player and shoot him/her to death.","villagers"));
spCharacters.push(createCharacter("whiteWolfKing","White Wolf King","White Wolf King belongs to werewolves.\nWhite Wolf King doesn't spell his skill until the day is come. \nThe White Wolf King must spell his skill before the voting start if he want.\nHe will sacrify himself and instantly kill another player.\nAfter that, the voting phase will be skipped and the night will come.","werewolves"));
spCharacters.push(createCharacter("wildKid","Wild Kid","Wild Kid belongs to villagers at first.\nWild Kid must select another player as his \"Example\". If the chosen player belongs to werewolves or he/she dies in two days, Wild Kid turns into werewolves side. Wild Kid doesn't know which side his \"Example\" belongs to.","villagers"));
spCharacters.push(createCharacter("cupid","Cupid","Cupid is not considered as a werewolf side character.\nHowever Cupid's winning condition is to help the couple he selected to survive.\nCupid has to select two different players(Can select himself) to link as couple. When one of the players in the couple die, the other one die as well.\nWhen one player in couple belongs to werewolves but the other one doesn't, Cupid and couple will form a third party(Cupid), which aiming to eliminate all the other players.","villagers"));
spCharacters.push(createCharacter("guard","Guard","Guard belongs to villagers.\nGuard can protect one player every night, the protected one will survive the wolf packs' attack. \nHowerver the guard don't know who is going to be attacked by werewolves.\nAnd guard can't prevent player from witch's posion.\nIn addition, guard can not protect the same player in two nights.","villagers"));


function showExplaination(name:string):void{
    let element:spCharacter = spCharacters[0];
    for(let i=0;i<spCharacters.length;i++){
        element = spCharacters[i];
        if(element.name === name){
            break;
        }
    }
    alert(element.explaination);
    return;
}

function findSpCharacter(query:object):any{
    let queryKey:any,queryKeyword:any,target:any;

    target = query["target"];
    if("name" in query){queryKey="name";queryKeyword=query["name"];}
    if("outName" in query){queryKey="outName";queryKeyword=query["outName"];}
    let element:spCharacter = spCharacters[0];
    for(let i=0;i<spCharacters.length;i++){
        element = spCharacters[i];
        if(element.name === queryKeyword||element.outName === queryKeyword){
            break;
        }
    }
    if(target==="side"){return element.side;}
    if(target==="name"){return element.name;}
    if(target==="outName"){return element.outName;}
    return 0;
}

//Execute when loading
window.onload = function(){
    dayIcon = document.getElementById("day")!;
    reset();
    let spcsRefHTML:string="<p><fieldset><legend>References for Special Roles</legend>";
    for(let i=0;spCharacters[i];++i){
        spcsRefHTML+=`<button onclick="showExplaination(\'${spCharacters[i].name}\')">What is ${spCharacters[i].outName}</button>         `;
    }
    spcsRefHTML+="</fieldset></p>";
    document.getElementById("charactersRef")!.innerHTML=spcsRefHTML;
}



