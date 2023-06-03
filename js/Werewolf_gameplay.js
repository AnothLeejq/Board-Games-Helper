"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = void 0;
function createPlayer(id, role, side) {
    return {
        id: id,
        role: role,
        alive: true,
        side: side
    };
}
function resetPlayer(target, variableType, newValue) {
    if (variableType === "role") {
        target.role = newValue;
    }
    if (variableType === "alive") {
        target.alive = newValue;
        if (newValue === false) {
            actionsList.push(createAction([target.id], target.role, "die", []));
            //couple die together
            if (cupid_bind.includes(target)) {
                var nextDie = (target === cupid_bind[0] ? cupid_bind[1] : cupid_bind[0]);
                cupid_bind = [];
                actionsList.push(createAction([nextDie.id], nextDie.role, "martyrdom", [target.id]));
                resetPlayer(nextDie, "alive", false);
            }
            //wild kid turn into werewolf
            if (round <= 2 && wkid_example.includes(target) && spcSelected["Wild Kid"].alive) {
                resetPlayer(spcSelected["Wild Kid"], "side", "werewolves");
                actionsList.push(createAction([target.id], target.role, "transformed", [spcSelected["Wild Kid"].id]));
            }
        }
    }
    if (variableType === "side") {
        target.side = newValue;
    }
}
function createAction(action_players, action_role, action_type, action_target) {
    return {
        day: round,
        isDay: day,
        action_role: action_role,
        action_players: action_players,
        action_type: action_type,
        action_target: action_target
    };
}
function createGameLogs(spcSet, logs) {
    return {
        id: Date().split(" GMT")[0].split(" ").join("-"),
        playersNum: players.length,
        rule: ruleId,
        spcSet: spcSet,
        logs: logs
    };
}
function writeFile(log) {
    var content = "", wolvesId = [];
    for (var i = 0; werewolves[i]; ++i) {
        wolvesId.push(werewolves[i].id);
    }
    //Title
    content += "Game logs\t".concat(log.id, "\nPlayers:").concat(log.playersNum, "\tRule:").concat(log.rule, "\nSpecial roles:").concat(log.spcSet, "\nWerewolves:").concat(wolvesId);
    //Detailed logs
    for (var i = 0; log.logs[i]; ++i) {
        var action = log.logs[i];
        if (action.action_type === "win") {
            //actionsList.push(createAction([],winSide,"win",[]));
            content += "\nGame ended, ".concat(action.action_role, " won.");
        }
        else if (action.action_type === "die") {
            //actionsList.push(createAction(dyingPlayer,dyingPlayer.role,"die",[]));
            content += "\nPlayer ".concat(action.action_players, " (").concat(action.action_role, ") died.");
        }
        else if (action.action_type === "switch") {
            //actionsList.push(createAction([],"night","switch",[]));
            content += "\n---Day ".concat(action.day, "(").concat(action.action_role, ")---");
        }
        else if (action.action_type === "transformed") {
            //actionsList.push(createAction(dyingPlayer,"dyingPlayer.role","transformed",wildkid));
            content += "\nThe wild kid (Player ".concat(action.action_target, ") joined werewolves for death of Player ").concat(action.action_players, ".");
        }
        else if (action.action_type === "martyrdom") {
            //actionsList.push(createAction(dyingPlayer,"dyingPlayer.role","martyrdom",whodiefor));
            content += "\nPlayer ".concat(action.action_players, " (").concat(action.action_role, ") committed suicide for Player ").concat(action.action_target, "'s death.");
        }
        else if (action.action_type === "voted") {
            //actionsList.push(createAction(dyingPlayer,"dyingPlayer.role","martyrdom",whodiefor));
            content += "\nPlayer ".concat(action.action_players, " (").concat(action.action_role, ") was voted to execute.");
        }
        else if (action.action_type === "exploded") {
            //actionsList.push(createAction(dyingPlayer,"dyingPlayer.role","martyrdom",whodiefor));
            content += "\nPlayer ".concat(action.action_players, " (").concat(action.action_role, ") exploded.");
        }
        else {
            content += "\n".concat(action.action_role, " (Player ").concat(action.action_players, ") ").concat(action.action_type, " Player ").concat(action.action_target);
        }
    }
    logHTML.innerText = content;
    var hrefStr = "<p><a href=\"data:text/plain;base64,".concat(btoa(content), "\" download=\"BGHelper-Werewolf-").concat(log.id, ".txt\">Download</a></p>");
    downloadLink.innerHTML = hrefStr;
    return hrefStr;
}
//Prepare the game data
var wolfNum, villagersNum, n_villagersNum;
var ruleId;
var players = [];
var stageTexts = [];
stageTexts.push("Night is coming, everyone close your eyes...");
stageTexts.push("Werewolves, open your eyes. Confirm your teammates then choose a player who is going to die.");
stageTexts.push("Seer, open your eyes. Select a player who you are going to check tonight.");
stageTexts.push("Sun rises! Everyone, open up your eyes.");
//Basic character data
var werewolves, villagers;
var round = 1, day = false;
var spcSelected = {}, playersList = {};
var werewolves_target = [], werewolves_actioned = false, seer_target, seer_actioned;
//Spcs data
var hunter_id, hunter_able;
var wwking_id, wwking_able;
var witch_potions, witch_potion_target, witch_poison_target, witch_actioned = false;
var wkid_example;
var cupid_bind;
var guard_target, guard_actioned;
//System data
var lastWordCount = -1;
var winSide = "";
var actionsList;
function reset() {
    //reset all the variables
    dayIcon.innerText = "";
    actionsList = [];
    logHTML.innerText = "";
    downloadLink.innerHTML = "";
    players = [], werewolves = [];
    villagers = [];
    spcSelected = {};
    playersList = {};
    cupid_bind = [];
    wkid_example = [];
    witch_potions = { "potion": 1, "poison": 1 };
    hunter_able = true;
    winSide = "";
    round = 1, day = false;
    werewolves_target = [];
    seer_target = 0;
    seer_actioned = false;
    werewolves_actioned = false;
    witch_actioned = false;
    guard_target = 0;
    guard_actioned = false;
    lastWordCount = -1;
    wolfNum = 0;
    villagersNum = 0;
    n_villagersNum = 0;
    var ruleZoneHTML = "<p><form id=\"ruleSelect\"><fieldset><legend>Game Rule</legend>";
    for (var i = 0; gameRules[i]; ++i) {
        ruleZoneHTML += "<input type=\"radio\" value=\"".concat(gameRules[i]["id"], "\" name=\"rule\" checked>").concat(gameRules[i]["explaination"], "<br />");
    }
    ruleZoneHTML += "</fieldset></form></p>";
    document.getElementById("ruleZone").innerHTML = ruleZoneHTML;
    var charactersHTML = "<p>Total players:<input id=\"playersNum\" type=\"number\" value=5 min=5></p><p><form action=\"Werewolf.html\" id=\"spcSelect\"><fieldset><legend>Special role</legend>";
    for (var i = 0; i < spCharacters.length; i++) {
        var element = spCharacters[i];
        var columnHTML = "";
        if (element.side === "villagers") {
            columnHTML = "<label><input type=\"checkbox\" class=\"spc\" id=\"spc_".concat(element.name, "\" name=\"").concat(element.name, "\" value=\"").concat(element.outName, "\"> ").concat(element.outName, "</label><br />");
        }
        else {
            columnHTML = "<label><input type=\"checkbox\" class=\"spw\" id=\"spc_".concat(element.name, "\" name=\"").concat(element.name, "\" value=\"").concat(element.outName, "\"> ").concat(element.outName, "</label><br />");
        }
        charactersHTML += columnHTML;
    }
    ;
    charactersHTML += "<input type=\"submit\" value=\"Done\"></fieldset></form></p>";
    document.getElementById("characters").innerHTML = charactersHTML;
    var spcSelect = document.getElementById("spcSelect");
    spcSelect === null || spcSelect === void 0 ? void 0 : spcSelect.addEventListener('submit', function (e) {
        e.preventDefault();
        var getSelectedSpcs = document.getElementsByClassName('spc');
        var checkedSpcs = [];
        for (var i = 0; i < getSelectedSpcs.length; i++) {
            var element = getSelectedSpcs[i];
            if (element.checked) {
                checkedSpcs.push(element.value);
            }
        }
        var getSelectedSpws = document.getElementsByClassName('spw');
        var checkedSpws = [];
        for (var i = 0; i < getSelectedSpws.length; i++) {
            var element = getSelectedSpws[i];
            if (element.checked) {
                checkedSpws.push(element.value);
            }
        }
        var playersNum = document.getElementById("playersNum").value;
        var ruleApplied = document.querySelector('input[name="rule"]:checked').value;
        gameStart(ruleApplied, playersNum, checkedSpcs, checkedSpws);
    });
}
exports.reset = reset;
function getPlayersInfo(players) {
    var charactersHTML = "<table><tr><td>---No.---</td><td>---Role---</td><td>---Status---</td><td>---Side---</tr>";
    for (var i = 0; players[i]; ++i) {
        var player = players[i];
        charactersHTML += "<tr><td>".concat(player.id, "</td><td>").concat(player.role, "</td><td>").concat((player.alive ? (cupid_bind.includes(player) ? "🥰" : player.side === "werewolves" ? "🐺" : "😊") : "💀") + (werewolves_target.includes(player) ? "🎯" : "") + (guard_target == player.id ? "🛡️" : "") + (witch_potion_target == player.id ? "💊" : (witch_poison_target == player.id ? "☠️" : "")) + (seer_target == player.id ? "🔍" : ""), "</td><td>").concat(player.side, "</td></tr>");
    }
    charactersHTML += "</table>";
    return charactersHTML;
}
function gameStart(rule, playersNum, spcs, spw) {
    var stageHTML = "Please confirm players set for ".concat(playersNum, " players");
    document.getElementById("stage").innerText = stageHTML;
    var ruleZoneHTML = "<p><fieldset><legend>Game Rule</legend>";
    switch (rule) {
        case ("r1"): {
            ruleZoneHTML += "Werewolves win when number of werewolves equals to Villagers left";
            ruleId = 1;
            break;
        }
        case ("r2"): {
            ruleZoneHTML += "Werewolves win when all villagers or all special characters belong to villagers' side killed";
            ruleId = 2;
            break;
        }
        case ("r3"): {
            ruleZoneHTML += "Werewolves win when all players belong to villagers' side killed";
            ruleId = 3;
            break;
        }
        default: {
            ruleZoneHTML += "Werewolves win when number of werewolves equals to villagers left";
            ruleId = 1;
        }
    }
    ruleZoneHTML += "</fieldset></p>";
    document.getElementById("ruleZone").innerHTML = ruleZoneHTML;
    var charactersHTML = "";
    //players list
    var notSelectedRoles = [];
    for (var i = 0; i < playersNum; i++) {
        notSelectedRoles.push(i + 1);
    }
    //Werewolves
    wolfNum = 1 + Math.floor((playersNum - 3) / 4);
    villagersNum = playersNum - wolfNum;
    var n_werewolves = [];
    var _loop_1 = function (i) {
        var randomInd = Math.floor(Math.random() * notSelectedRoles.length);
        var chosen = notSelectedRoles[randomInd];
        var newplayer = createPlayer(chosen, "Werewolf", "werewolves");
        werewolves.push(newplayer);
        n_werewolves.push(newplayer);
        players.push(newplayer);
        playersList[newplayer.id] = newplayer;
        notSelectedRoles = notSelectedRoles.filter(function (e) { return e !== chosen; });
    };
    for (var i = 0; i < wolfNum; i++) {
        _loop_1(i);
    }
    //Seer
    spcs.push('Seer');
    var _loop_2 = function (i) {
        var randomInd = Math.floor(Math.random() * notSelectedRoles.length);
        var chosen = notSelectedRoles[randomInd];
        var newplayer = createPlayer(chosen, spcs[i], "villagers");
        villagers.push(newplayer);
        players.push(newplayer);
        playersList[newplayer.id] = newplayer;
        spcSelected[spcs[i]] = newplayer;
        notSelectedRoles = notSelectedRoles.filter(function (e) { return e !== chosen; });
    };
    //other spcs & wolves
    for (var i = 0; spcs[i]; ++i) {
        _loop_2(i);
    }
    var _loop_3 = function (i) {
        var randomInd = Math.floor(Math.random() * n_werewolves.length);
        var chosen = n_werewolves[randomInd];
        resetPlayer(chosen, "role", spw[i]);
        spcSelected[spw[i]] = chosen;
        n_werewolves = n_werewolves.filter(function (e) { return e !== chosen; });
    };
    for (var i = 0; spw[i]; ++i) {
        _loop_3(i);
    }
    //normal villagers
    for (var i = 0; notSelectedRoles[i]; ++i) {
        var newplayer = createPlayer(notSelectedRoles[i], "Villager", "villagers");
        playersList[newplayer.id] = newplayer;
        players.push(newplayer);
        villagers.push(newplayer);
        n_villagersNum += 1;
    }
    players.sort(function (a, b) { return a.id - b.id; });
    charactersHTML += getPlayersInfo(players);
    charactersHTML += "<p><button onclick=\"startConfirmed()\">Let's get started!</button><br /><br /><button onclick=\"reset()\">Cancel</button></p>";
    document.getElementById("characters").innerHTML = charactersHTML;
}
function startConfirmed() {
    var stageHTML = "(Click \"next\" button below to start a game.)\nNow the night is coming, everyone close your eyes!";
    document.getElementById("stage").innerText = stageHTML;
    var charactersHTML = getPlayersInfo(players);
    charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
    document.getElementById("characters").innerHTML = charactersHTML;
    dayIcon.innerText = "Day ".concat(round, " - \uD83C\uDF19");
    actionsList.push(createAction([], "night", "switch", []));
}
function next(stage) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (stage === void 0) { stage = ""; }
    if (stage === "") {
        //One-turn characters
        if ("Cupid" in spcSelected && round === 1 && cupid_bind.length === 0) {
            next("CupidCheck");
            return;
        }
        if ("Wild Kid" in spcSelected && round === 1 && wkid_example.length === 0) {
            next("WildKidCheck");
            return;
        }
        if (!werewolves_actioned) {
            next("WerewolvesCheck");
            return;
        }
        if ("Witch" in spcSelected && !witch_actioned) {
            next("WitchCheck1");
            return;
        }
        if ("Guard" in spcSelected && !guard_actioned) {
            next("GuardCheck");
            return;
        }
        if (!seer_actioned) {
            next("SeerCheck");
            return;
        }
        actionsList.push(createAction([], "day", "switch", []));
        nightEnd();
        return;
    }
    else {
        var stageTexts_1 = "", charactersHTML = getPlayersInfo(players);
        //Cupid
        if (stage === "CupidCheck") {
            stageTexts_1 = "Open your eyes, Cupid. Please link two players whom you want to make to be couple.";
            charactersHTML += "<p>Cupid(Player No.".concat(spcSelected["Cupid"].id, ") links <input id=\"cupid1\" type=\"number\" min=1 max=").concat(players.length, "> and <input id=\"cupid2\" type=\"number\" min=1 max=").concat(players.length, "></p>");
            charactersHTML += "<p><button onclick=\"next('Cupid')\">Next>></button></p>";
        }
        if (stage === "Cupid") {
            var cupidLink1 = (_a = document.getElementById("cupid1")) === null || _a === void 0 ? void 0 : _a.value;
            var cupidLink2 = (_b = document.getElementById("cupid2")) === null || _b === void 0 ? void 0 : _b.value;
            if (cupidLink1 === "" || cupidLink2 === "" || cupidLink1 === null || cupidLink1 === undefined || cupidLink2 === null || cupidLink2 === undefined) {
                alert("You must input a valid number of both two players");
                next("CupidCheck");
                return;
            }
            if (cupidLink1 == cupidLink2) {
                alert("Can not link the same player");
                next("CupidCheck");
                return;
            }
            resetPlayer(spcSelected["Cupid"], "side", "cupid"); //Cupid is the third party.
            stageTexts_1 = "(Cupid linked Player No.".concat(cupidLink1, " and No.").concat(cupidLink2, " together.) \n(GM need to wake up two players secrectly now) \nWake up couples, please confirm your couple.\nClose your eyes, Cupid.");
            if (playersList[cupidLink1].side !== playersList[cupidLink2].side) {
                if (playersList[cupidLink1].side !== "cupid" && playersList[cupidLink2].side !== "cupid") {
                    resetPlayer(playersList[cupidLink1], "side", "cupid");
                    resetPlayer(playersList[cupidLink2], "side", "cupid");
                }
                else {
                    if (playersList[cupidLink1].side === "cupid") {
                        resetPlayer(playersList[cupidLink1], "side", "cupid(".concat(playersList[cupidLink2].side, ")"));
                    }
                    if (playersList[cupidLink2].side === "cupid") {
                        resetPlayer(playersList[cupidLink2], "side", "cupid(".concat(playersList[cupidLink1].side, ")"));
                    }
                }
            }
            cupid_bind = [playersList[cupidLink1], playersList[cupidLink2]];
            charactersHTML = getPlayersInfo(players); //User status updated here, need to update to the interface.
            charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            actionsList.push(createAction([spcSelected["Cupid"].id], spcSelected["Cupid"].role, "linked", [cupidLink1, cupidLink2]));
        }
        //Wild Kid
        if (stage === "WildKidCheck") {
            stageTexts_1 = "Open your eyes, Wild Kid. Please select a player who you want to follow.";
            charactersHTML += "<p>Wild Kid(Player No.".concat(spcSelected["Wild Kid"].id, ") decide to follow Player No.<input id=\"wkid\" type=\"number\" min=1 max=").concat(players.length, "></p>");
            charactersHTML += "<p><button onclick=\"next('WildKid')\">Next>></button></p>";
        }
        if (stage === "WildKid") {
            var wkExample = (_c = document.getElementById("wkid")) === null || _c === void 0 ? void 0 : _c.value;
            if (wkExample === "" || wkExample === null || wkExample === undefined) {
                alert("You must input a valid number of a player");
                next("WildKidCheck");
                return;
            }
            if (wkExample == spcSelected["Wild Kid"].id) {
                alert("Wild kid can not follow himself");
                next("WildKidCheck");
                return;
            }
            stageTexts_1 = "(Wild Kid followed Player No.".concat(wkExample, " as \"example\".) \n(DO NOT wake up anyone else.) \nClose your eyes, wild kid.");
            if (playersList[wkExample].side === "werewolves" || playersList[wkExample].role === "Werewolf" || findSpCharacter({ "outName": playersList[wkExample].role, "target": "side" }) === "werewolves") {
                resetPlayer(spcSelected["Wild Kid"], "side", "werewolves");
            }
            wkid_example = [playersList[wkExample]];
            charactersHTML = getPlayersInfo(players); //User status updated here, need to update to the interface.
            charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            actionsList.push(createAction([spcSelected["Wild Kid"].id], spcSelected["Wild Kid"].role, "decided to follow", [wkExample]));
        }
        //Werewolves
        if (stage === "WerewolvesCheck") {
            stageTexts_1 = "Open your eyes, Werewolves.";
            if (round === 1) {
                stageTexts_1 += "\nPlease confirm your teammates.";
            }
            stageTexts_1 += "\nPlease select a player who you want to kill.";
            charactersHTML += "<p>Werewolves pack decide to kill Player No.<input id=\"kill\" type=\"number\" min=1 max=".concat(players.length, "></p>");
            charactersHTML += "<p><button onclick=\"next('Werewolves')\">Next>></button></p>";
        }
        if (stage === "Werewolves") {
            var target = (_d = document.getElementById("kill")) === null || _d === void 0 ? void 0 : _d.value;
            if (target === "" || target === null || target === undefined || playersList[target].alive === false) {
                alert("You must input a valid number of a living player");
                next("WerewolvesCheck");
                return;
            }
            stageTexts_1 = "(Werewolves pack decide to kill Player No.".concat(target, ".) \nClose your eyes, werewolves.");
            werewolves_target = [playersList[target]];
            charactersHTML = getPlayersInfo(players); //User status updated here, need to update to the interface.
            werewolves_actioned = true;
            charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            var wolfId_1 = [];
            werewolves.forEach(function (element) {
                wolfId_1.push(element.id);
            });
            actionsList.push(createAction(wolfId_1, "Werewolves", "attacked", [target]));
        }
        //Witch
        if (stage === "WitchCheck1") {
            stageTexts_1 = "Open your eyes, Witch.";
            if (witch_potions["potion"] > 0 && spcSelected["Witch"].alive) {
                stageTexts_1 += "\nYou have a bottle of potion.\nAnd this player is dying tonight (No.".concat(werewolves_target[0].id, " ,GM should tell witch without making noise).\nAre you going to save?");
                charactersHTML += "<p><button onclick=\"next('Witch1')\">Heal!</button><br /><button onclick=\"next('WitchCheck2')\">No</button></p>";
            }
            else {
                stageTexts_1 += "\nYou have a bottle of potion.\nAnd this player is dying tonight (Witch is unable to know this as she has no potion or dies).\nAre you going to save?\n\n(Yes, it's no use to say but GM should read these as normal or other players will know the status of witch.)";
                charactersHTML += "<p><button onclick=\"next('WitchCheck2')\">Do not have potion or dies, next>></button></p>";
            }
        }
        if (stage === "Witch1") {
            var target = werewolves_target[0];
            witch_potion_target = target.id;
            stageTexts_1 = "(Witch healed Player No.".concat(witch_potion_target, ", so she can not use poison toight. But GM still need to read the sentence below as normal. Or other player will know the status of witch.) \nYou have a bottle of poison, who are you going to poison?\n(Wait for a while then say)\nClose your eyes please, witch.");
            charactersHTML = getPlayersInfo(players); //User status updated here, need to update to the interface.
            charactersHTML += "<p><button onclick=\"next()\">Can not use posion, next>></button></p>";
            witch_actioned = true;
            witch_potions["potion"] = 0;
            actionsList.push(createAction([spcSelected["Witch"].id], "Witch", "healed", [target.id]));
        }
        if (stage === "WitchCheck2") {
            if (witch_potions["poison"] > 0 && spcSelected["Witch"].alive) {
                stageTexts_1 = "You have a bottle of poison, who are you going to poison?\n(GM should input 0 or leave blank if witch don't want to posion anyone tonight.)";
                charactersHTML += "<p>Witch (Player No.".concat(spcSelected["Witch"].id, ") decide to poison Player No.<input id=\"poison\" type=\"number\" min=0 max=").concat(players.length, "></p>");
                charactersHTML += "<p><button onclick=\"next('Witch2')\">Next>></button></p>";
            }
            else {
                stageTexts_1 = "You have a bottle of poison, who are you going to poison?\n(Yes, witch has no posion or dies, however GM should still say this to prevent other players from knowing the status of witch.)";
                witch_actioned = true;
                charactersHTML += "<p><button onclick=\"next()\">Do not have poison or dies, next>></button></p>";
            }
        }
        if (stage === "Witch2") {
            var target = (_e = document.getElementById("poison")) === null || _e === void 0 ? void 0 : _e.value;
            if (target == 0 || target === "" || target === null || target === undefined || playersList[target].alive === false) {
                stageTexts_1 = "(Witch decided not to use posion tonight.)\nClose your eyes please, witch.";
            }
            else {
                witch_poison_target = target;
                witch_potions["poison"] = 0;
                actionsList.push(createAction([spcSelected["Witch"].id], "Witch", "poisoned", [target]));
                charactersHTML = getPlayersInfo(players); //User status updated here, need to update to the interface.
                stageTexts_1 = "(Witch decided to posion Player No.".concat(target, " tonight.)\nClose your eyes please, witch.");
            }
            charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            witch_actioned = true;
        }
        //Guard
        if (stage === "GuardCheck") {
            stageTexts_1 = "Open your eyes, guard. Who are you going to protect?";
            if (spcSelected["Guard"].alive) {
                if (round > 1) {
                    stageTexts_1 += "\n(Last night, guard protected Player No.".concat(guard_target, ")");
                }
                charactersHTML += "<p>Guard (Player No.".concat(spcSelected["Guard"].id, ") decide to protect Player No.<input id=\"guard\" type=\"number\" min=1 max=").concat(players.length, "></p>");
                charactersHTML += "<p><button onclick=\"next('Guard')\">Next>></button></p>";
            }
            else {
                stageTexts_1 += "\n(Guard is dead, but GM need to say as if guard is alive.)\nClose your eyes please, guard.";
                guard_target = 0;
                guard_actioned = true;
                charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            }
        }
        if (stage === "Guard") {
            var target = (_f = document.getElementById("guard")) === null || _f === void 0 ? void 0 : _f.value;
            if (target === "" || target === null || target === undefined || playersList[target].alive === false) {
                alert("Plase input a valid player number of a living player, guard must protect a player every night.");
                next("GuardCheck");
                return;
            }
            if (guard_target === target) {
                alert("Can not protect same player in two nights.");
                next("GuardCheck");
                return;
            }
            guard_target = target;
            guard_actioned = true;
            charactersHTML = getPlayersInfo(players); //User status updated here, need to update to the interface.
            stageTexts_1 = "(Guard decided to protect Player No.".concat(target, " tonight.)\nClose your eyes please, guard.");
            charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            actionsList.push(createAction([spcSelected["Guard"].id], "Guard", "protected", [target]));
        }
        //Seer
        if (stage === "SeerCheck") {
            stageTexts_1 = "Open your eyes, seer. Who are you going to check?";
            if (spcSelected["Seer"].alive) {
                charactersHTML += "<p>Seer (Player No.".concat(spcSelected["Seer"].id, ") decide to check Player No.<input id=\"seer\" type=\"number\" min=1 max=").concat(players.length, "></p>");
                charactersHTML += "<p><button onclick=\"next('Seer')\">Next>></button></p>";
            }
            else {
                seer_target = 0;
                stageTexts_1 += "\n(Seer is dead, but GM need to say as if seer is alive.)\nThis player belongs to (Stop and do nothing for a while)\nIs that clear? Close your eyes please, seer.";
                seer_actioned = true;
                charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            }
        }
        if (stage === "Seer") {
            var target = (_g = document.getElementById("seer")) === null || _g === void 0 ? void 0 : _g.value;
            if (target === "" || target === null || target === undefined || playersList[target].alive === false) {
                alert("Plase input a valid player number of a living player, seer must check a player every night.");
                next("SeerCheck");
                return;
            }
            seer_target = target;
            charactersHTML = getPlayersInfo(players); //User status updated here, need to update to the interface.
            seer_actioned = true;
            stageTexts_1 = "(Seer decided to check Player No.".concat(target, " tonight.) \nThis player belongs to ").concat(playersList[target].side === "werewolves" || playersList[target].role === "Werewolf" || findSpCharacter({ "outName": playersList[target].role, "target": "side" }) === "werewolves" ? "(👎)" : "(👍)", "\nIs that clear? Close your eyes please, seer.");
            charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
            actionsList.push(createAction([spcSelected["Seer"].id], "Seer", "checked", [target]));
        }
        document.getElementById("characters").innerHTML = charactersHTML;
        document.getElementById("stage").innerText = stageTexts_1;
    }
}
function isGameEnd() {
    wolfNum = 0;
    villagersNum = 0;
    n_villagersNum = 0;
    for (var i = 0; players[i]; ++i) {
        var player = players[i];
        if (player.side === "werewolves" || player.role === "Werewolf" || findSpCharacter({ "outName": player.role, "target": "side" }) === "werewolves") {
            if (player.alive) {
                wolfNum += 1;
            }
        }
        else {
            if (player.alive) {
                villagersNum += 1;
                if (player.role === "Villager") {
                    n_villagersNum += 1;
                }
            }
        }
    }
    if (cupid_bind.length > 0) {
        var cupidWin = true;
        for (var i = 0; players[i]; ++i) {
            if (players[i].side !== "cupid" && players[i].alive) {
                cupidWin = false;
                break;
            }
        }
        if (cupidWin) {
            winSide = "Cupid";
            return true;
        }
    }
    if (ruleId === 1 && wolfNum >= villagersNum) {
        winSide = "Werewolves";
        return true;
    }
    if (ruleId === 2 && ((n_villagersNum <= 0) || (villagersNum - n_villagersNum <= 0))) {
        winSide = "Werewolves";
        return true;
    }
    if (ruleId === 3 && (villagersNum <= 0) && wolfNum > 0) {
        winSide = "Werewolves";
        return true;
    }
    if (wolfNum == 0) {
        winSide = "Villagers";
        return true;
    }
    return false;
}
function requestLog() {
    var spcSelectedName = [];
    for (var key in spcSelected) {
        spcSelectedName.push("".concat(key, "(Player ").concat(spcSelected[key].id, ")"));
    }
    var logsList = createGameLogs(spcSelectedName, actionsList);
    writeFile(logsList);
    return;
}
function dayEnd() {
    witch_potion_target = 0;
    witch_poison_target = 0;
    werewolves_target = [];
    seer_target = 0;
    day = false;
    if (guard_target > 0) {
        if (spcSelected["Guard"].alive === false) {
            guard_target = 0;
        }
    }
    var stageTexts = "";
    var charactersHTML = getPlayersInfo(players);
    if (isGameEnd()) {
        stageTexts = "Game over. ".concat(winSide, " win!");
        actionsList.push(createAction([], winSide, "win", []));
        charactersHTML += "<p><button onclick=\"requestLog()\">Request logs of this game</button></p>";
        charactersHTML += "<p><button onclick=\"reset()\">Restart</button></p>";
    }
    else {
        stageTexts = "The night has come. Close your eyes, everyone!";
        charactersHTML += "<p><button onclick=\"next()\">Next>></button></p>";
        round += 1;
        actionsList.push(createAction([], "night", "switch", []));
    }
    dayIcon.innerText = "Day ".concat(round, " - \uD83C\uDF19");
    document.getElementById("characters").innerHTML = charactersHTML;
    document.getElementById("stage").innerText = stageTexts;
    return;
}
function nightEnd(restart) {
    var _a, _b, _c, _d;
    if (restart === void 0) { restart = ""; }
    var charactersHTML = getPlayersInfo(players);
    if (restart === "") {
        day = true;
        dayIcon.innerText = "Day ".concat(round, " - \u2600\uFE0F");
        werewolves_actioned = false;
        witch_actioned = false;
        seer_actioned = false;
        guard_actioned = false;
        var dyingPlayers = [];
        //Witch poison player
        if (witch_poison_target > 0) {
            dyingPlayers.push(playersList[witch_poison_target]);
            if (playersList[witch_poison_target].role === "Hunter" && hunter_able) {
                hunter_able = false;
            }
            ;
            witch_poison_target = 0;
        }
        var _loop_4 = function (i) {
            if (witch_potion_target == werewolves_target[i].id) {
                werewolves_target = werewolves_target.filter(function (e) { return e !== werewolves_target[i]; });
                return "continue";
            }
            if (guard_target == werewolves_target[i].id) {
                werewolves_target = werewolves_target.filter(function (e) { return e !== werewolves_target[i]; });
                return "continue";
            }
            dyingPlayers.push(werewolves_target[i]);
        };
        //saving judgements
        for (var i = 0; werewolves_target[i]; ++i) {
            _loop_4(i);
        }
        werewolves_target = [];
        //execute
        var hunter_die = false;
        var stageTexts_2 = "The night has gone. Open your eyes, everyone!";
        var dyingIds = [];
        for (var i = 0; dyingPlayers[i]; ++i) {
            var dead = dyingPlayers[i];
            resetPlayer(dead, "alive", false);
            //Death rattles from hunter
            if (dead.role === "Hunter" && hunter_able) {
                hunter_die = true;
            }
        }
        //List dead players number
        charactersHTML = getPlayersInfo(players);
        for (var i = 0; players[i]; ++i) {
            var dead = players[i];
            if (dyingPlayers.includes(dead)) {
                dyingIds.push(dead.id);
            }
        }
        stageTexts_2 += dyingIds.length > 0 ? "\nPlayer(s) with these number(s) didn't survive last night:".concat(dyingIds) : "\nLast night was peaceful, no one died.";
        if (hunter_die) {
            stageTexts_2 += "\nA hunter died! Please select a player to bring with you to death.";
            charactersHTML += "<p>Hunter is going to shoot Player No.<input id=\"hunter\" type=\"number\" min=1 max=".concat(players.length, "></p>");
            charactersHTML += "<button onclick=\"nightEnd('hunter')\">Hunter shoot</button></p>";
            document.getElementById("stage").innerText = stageTexts_2;
            document.getElementById("characters").innerHTML = charactersHTML;
            return;
        }
        //System execute end, insert a judgement
        if (isGameEnd()) {
            stageTexts_2 = "Game over. ".concat(winSide, " win!");
            actionsList.push(createAction([], winSide, "win", []));
            charactersHTML += "<p><button onclick=\"requestLog()\">Request logs of this game</button></p>";
            charactersHTML += "<p><button onclick=\"reset()\">Restart</button></p>";
            document.getElementById("stage").innerText = stageTexts_2;
            document.getElementById("characters").innerHTML = charactersHTML;
            return;
        }
        //Game not end
        if ("White Wolf King" in spcSelected && spcSelected["White Wolf King"].alive) {
            charactersHTML += "<p>Fill in this blank and skip voting & last word when White Wolf King spelled his skill \u27A1\uFE0F Player No.<input id=\"wwking\" type=\"number\" min=1 max=".concat(players.length, ">");
            charactersHTML += "<button onclick=\"nightEnd('ww_explode')\">White Wolf Explode</button></p>";
        }
        charactersHTML += "<p>Fill in this blank and skip voting & last word when a normal werewolf explode \u27A1\uFE0F Player No. of the exploded werewolf:<input id=\"we\" type=\"number\" min=1 max=".concat(players.length, ">");
        charactersHTML += "<button onclick=\"nightEnd('w_explode')\">Wolf Explode</button></p>";
        charactersHTML += "<button onclick=\"nightEnd('vote')\">None of above, vote&last word>></button></p>";
        document.getElementById("stage").innerText = stageTexts_2;
        document.getElementById("characters").innerHTML = charactersHTML;
        return;
    }
    else {
        if (restart === "w_explode") {
            var target = (_a = document.getElementById("we")) === null || _a === void 0 ? void 0 : _a.value;
            if (target === "" || target === undefined || target === null) {
                alert("You must input a valid player number.");
                return;
            }
            if (playersList[target].alive === true && (playersList[target].side === "werewolves" || playersList[target].role === "Werewolf" || findSpCharacter({ "outName": playersList[target].role, "target": "side" }) === "werewolves")) {
                actionsList.push(createAction([target], "Werewolf", "exploded", [target]));
                resetPlayer(playersList[target], "alive", false);
                dayEnd();
                return;
            }
            else {
                alert("This is not a living werewolf.");
                return;
            }
        }
        if (restart === "ww_explode") {
            var target = (_b = document.getElementById("wwking")) === null || _b === void 0 ? void 0 : _b.value;
            if (target === "" || target === undefined || target === null) {
                alert("You must input a valid player number.");
                return;
            }
            ;
            if (playersList[target].alive === true && playersList[target].role !== "White Wolf King") {
                actionsList.push(createAction([spcSelected["White Wolf King"].id], "White Wolf King", "exploded and killed", [target]));
                resetPlayer(playersList[target], "alive", false);
                resetPlayer(spcSelected["White Wolf King"], "alive", false);
                dayEnd();
                return;
            }
            else {
                alert("This is not a living player or this is White Wolf King himself.");
                return;
            }
            ;
        }
        ;
        if (restart === "hunter") {
            var target = (_c = document.getElementById("hunter")) === null || _c === void 0 ? void 0 : _c.value;
            if (target === "" || target === undefined || target === null) {
                alert("You must input a valid player number.");
                return;
            }
            ;
            if (playersList[target].alive === true) {
                actionsList.push(createAction([spcSelected["Hunter"].id], "Hunter", "died and shot", [target]));
                resetPlayer(playersList[target], "alive", false);
                var stageTexts_3 = "(Hunter shooted Player No.".concat(target, " to die with him.)");
                hunter_able = false;
                charactersHTML = getPlayersInfo(players);
                charactersHTML += "<button onclick=\"nightEnd()\">Okay, back>></button></p>";
                document.getElementById("stage").innerText = stageTexts_3;
                document.getElementById("characters").innerHTML = charactersHTML;
            }
            else {
                alert("This is not a living player.");
                return;
            }
            ;
        }
        ;
        if (restart === "hunterX") {
            var target = (_d = document.getElementById("hunter")) === null || _d === void 0 ? void 0 : _d.value;
            if (target === "" || target === undefined || target === null) {
                alert("You must input a valid player number.");
                return;
            }
            ;
            if (playersList[target].alive === true) {
                actionsList.push(createAction([spcSelected["Hunter"].id], "Hunter", "died and shot", [target]));
                resetPlayer(playersList[target], "alive", false);
                hunter_able = false;
                dayEnd();
                return;
            }
            else {
                alert("This is not a living player.");
                return;
            }
            ;
        }
        ;
        if (restart === "vote") {
            var stageTexts_4 = "Time for voting!";
            if (lastWordCount > 0) {
                lastWordCount -= 1;
                stageTexts_4 += "\n".concat(lastWordCount, " days left for last words.");
            }
            else if (lastWordCount < 0) {
                stageTexts_4 += "\nDo not forget last words.";
            }
            else {
                stageTexts_4 += "\nUnfortunately, no last word permitted.";
            }
            charactersHTML += "<p>Vote a player to execute \u27A1\uFE0F <input id=\"vote\" type=\"number\" min=1 max=".concat(players.length, ">");
            charactersHTML += "<button onclick=\"nightEnd('voteEnd')\">Decided, next>></button></p>";
            document.getElementById("stage").innerText = stageTexts_4;
            document.getElementById("characters").innerHTML = charactersHTML;
        }
        ;
        if (restart === "voteEnd") {
            var target = document.getElementById("vote").value;
            if (target === "" || target === undefined || target === null) {
                alert("You must input a valid player number.");
                return;
            }
            ;
            if (playersList[target].alive === true) {
                day = false;
                actionsList.push(createAction([target], playersList[target].role, "voted", []));
                resetPlayer(playersList[target], "alive", false);
                if (playersList[target].role === "Hunter") {
                    var stageTexts_5 = "A hunter was voted to die! Hunter, please select a player to bring with you to death.";
                    charactersHTML = getPlayersInfo(players);
                    charactersHTML += "<p>Hunter is going to shoot Player No.<input id=\"hunter\" type=\"number\" min=1 max=".concat(players.length, "></p>");
                    hunter_able = false;
                    charactersHTML += "<button onclick=\"nightEnd('hunterX')\">Hunter shoot</button></p>";
                    document.getElementById("stage").innerText = stageTexts_5;
                    document.getElementById("characters").innerHTML = charactersHTML;
                    return;
                }
                else {
                    dayEnd();
                    return;
                }
            }
            else {
                alert("This is not a living player.");
                return;
            }
            ;
        }
        ;
    }
    ;
}
