//Game rule data
var gameSet = [];
gameSet.push({ "player_num": 5, "good": 3, "quests": [2, 3, 2, 3, 3] });
gameSet.push({ "player_num": 6, "good": 4, "quests": [2, 3, 4, 3, 4] });
gameSet.push({ "player_num": 7, "good": 4, "quests": [2, 3, 3, 4, 4] });
gameSet.push({ "player_num": 8, "good": 5, "quests": [3, 4, 4, 5, 5] });
gameSet.push({ "player_num": 9, "good": 6, "quests": [3, 4, 4, 5, 5] });
gameSet.push({ "player_num": 10, "good": 6, "quests": [3, 4, 4, 5, 5] });
var playerNum = 5, questProgress, questLeaderId, roleMerlinId;
var winSide, avalon_selectedSpcGroup, leaderVoteTime;
var avalon_header, avalon_GMscript, avalon_characters;
var avalon_spCharacters = [];
avalon_spCharacters.push({ "name": "Percival", "explaination": "Percival is on the side of Good. \nPercival's special power is knowledge of Merlin at the start of the game.\n*Note: for games of 5 players, you must add either Mordred or Morgana when playing with Percival." });
avalon_spCharacters.push({ "name": "Mordred", "explaination": "Mordred is on the side of Evil. \nHis special power is that his identity is not revealed to Merlin at the start of the game." });
avalon_spCharacters.push({ "name": "Oberon", "explaination": "Oberon is on the side of Evil. \nHis special power is that he does not reveal himself to the other evil players, nor does he gain knowledge of the other evil players at the start of the game.\nOberon is not a \"minion of mordred\" and does not open his eyes during the reveal at the start of the game." });
avalon_spCharacters.push({ "name": "Morgana", "explaination": "Morgana is on the side of evil. \nHer power is that she appears to be Merlin - revealing herself to Percival as Merlin." });
function avalon_showExplaination(name) {
    var element = avalon_spCharacters[0];
    for (var i = 0; i < avalon_spCharacters.length; i++) {
        element = avalon_spCharacters[i];
        if (element["name"] === name) {
            break;
        }
    }
    alert(element["explaination"]);
    return;
}
function avalon_reset() {
    questProgress = [], winSide = "", avalon_selectedSpcGroup = [];
    leaderVoteTime = 0;
    questLeaderId = 0;
    var playerNumInputHTML = "<p>Total players:<input id=\"playersNum\" type=\"number\" value=".concat(playerNum, " min=5 max=10></p>");
    var characterInputHTML = "<p><form action=\"Werewolf.html\" id=\"spcSelect\"><fieldset><legend>Extra role</legend>";
    for (var i = 0; i < avalon_spCharacters.length; i++) {
        var element = avalon_spCharacters[i];
        var columnHTML = "";
        columnHTML = "<label><input type=\"checkbox\" class=\"avalon_spc\" id=\"spc_".concat(element["name"], "\" name=\"").concat(element["name"], "\" value=\"").concat(element["name"], "\"> ").concat(element["name"], "</label><br>");
        characterInputHTML += columnHTML;
    }
    ;
    characterInputHTML += "<input type=\"submit\" value=\"Done\"></fieldset></form></p>";
    avalon_GMscript.innerHTML = playerNumInputHTML;
    avalon_characters.innerHTML = characterInputHTML;
    avalon_header.innerHTML = "";
    var spcSelect = document.getElementById("spcSelect");
    spcSelect === null || spcSelect === void 0 ? void 0 : spcSelect.addEventListener('submit', function (e) {
        e.preventDefault();
        var getSelectedSpcs = document.getElementsByClassName('avalon_spc');
        for (var i = 0; getSelectedSpcs[i]; ++i) {
            if (getSelectedSpcs[i].checked) {
                avalon_selectedSpcGroup.push(getSelectedSpcs[i].value);
            }
        }
        var playersNum = document.getElementById("playersNum").value;
        if (playersNum == 5 && avalon_selectedSpcGroup.includes("Percival") && !avalon_selectedSpcGroup.includes("Mordred") && !avalon_selectedSpcGroup.includes("Morgana")) {
            alert("You must add Mordred or Morgana if 5 players play with Percival!");
        }
        else {
            avalon_gameStart(playersNum);
        }
    });
}
function avalon_gameStart(players) {
    avalon_header.innerHTML = "<p>Players: ".concat(players, ", there should be ").concat(gameSet[players - 5]["good"], " players from good side and ").concat(players - gameSet[players - 5]["good"], " players from evil side.<br>(Please prepare corresponding characters card and randomly give them to each players.)</p>");
    var avalon_GMScriptHTML = "<p>(After everyone get their card, read those lines below without brackets)<br>\n    Everyone close your eyes and extend your hand info a fist in front of you.<br>Minions of Mordred,".concat(avalon_selectedSpcGroup.includes("Oberon") ? " not Oberon," : "", " open your eyes and look around so that you know all agents of Evil..<br>Minions of Mordred close your eyes..<br>All players should have their eyes closed and hands in a fist in front of them..<br>Minions of Mordred").concat(avalon_selectedSpcGroup.includes("Mordred") ? ", not Mordred himself" : "", " - extend your thumb so that Merlin will know of you..<br>\n    Merlin, open your eyes and see the agents of evil..<br>\n    </p>");
    avalon_GMscript.innerHTML = avalon_GMScriptHTML;
    avalon_characters.innerHTML = "<p>Player number of Merlin is <input type=number min=1 max=".concat(players, " id=\"merlin\"></p>    <p><button class=\"buttonapprove\" onclick=\"avalon_startConfirmed()\">confirmed</button><br><br><button class=\"buttoncancel\" onclick=\"avalon_reset()\">Cancel</button></p>");
    playerNum = players;
}
function avalon_startConfirmed() {
    var MerlinNumber = document.getElementById("merlin").value;
    if (MerlinNumber == "" || MerlinNumber === undefined || MerlinNumber === null) {
        alert("Merlin's player number should be a valid number (1 to ".concat(playerNum, ")"));
    }
    else {
        roleMerlinId = MerlinNumber;
        var avalon_GMScriptHTML = "<p>(Read those lines below without brackets)<br>\n        Minions of Mordred - put your thumbs down and re-form your hands into a fist.<br>\n        Merlin, close your eyes..<br>\n        ".concat(avalon_selectedSpcGroup.includes("Percival") ? "Merlin".concat(avalon_selectedSpcGroup.includes("Morgana") ? " and Morgana" : "", " - extend your tumb so that Percival may know of you.<br>\n        Percival, open your eyes so you may know Merlin").concat(avalon_selectedSpcGroup.includes("Morgana") ? " and Morgana" : "", ".<br>\n        Merlin").concat(avalon_selectedSpcGroup.includes("Morgana") ? " and Morgana" : "", " - put your thumbs down and form your hand info a fist..<br>\n        Percival - close your eyes.<br>") : "", "\n        Everyone open your eyes..<br>\n        </p>");
        avalon_GMscript.innerHTML = avalon_GMScriptHTML;
        avalon_characters.innerHTML = "<p><button class=\"buttonapprove\" onclick=\"avalon_vote(0)\">next>></button></p>";
    }
}
function avalon_vote(questNumber) {
    leaderVoteTime += 1;
    if (questLeaderId < playerNum) {
        questLeaderId += 1;
    }
    else {
        questLeaderId = 1;
    }
    if (leaderVoteTime == 6) {
        avalon_gameOver("Evil", "team vote got 5 rejections in single round");
        return;
    }
    var avalon_GMScriptHTML = "<p>Here comes quest ".concat(questNumber + 1, ", <br>the leader will be Player No.").concat(questLeaderId, ". Team leader, please select ").concat(gameSet[playerNum - 5]["quests"][questNumber], " members to form your group for quest!</p>\n    <p>(After Player No.").concat(questLeaderId, " made decision) Now everybody should vote for the decision of Player No.").concat(questLeaderId, "</p>");
    avalon_GMscript.innerHTML = avalon_GMScriptHTML;
    var avalon_charactersHTML = "<p>Click <button class=\"buttonapprove\" onclick=\"avalon_quest(".concat(questNumber, ")\">Approve</button> if more players voted for approve than reject.</p>\n    <br>Otherwise, click <button class=\"buttonreject\" onclick=\"avalon_vote(").concat(questNumber, ")\">Reject</button></p>");
    avalon_characters.innerHTML = avalon_charactersHTML;
    return;
}
function avalon_quest(questNumber) {
    leaderVoteTime = 0;
    var failureVote = ((questNumber == 3) && (playerNum >= 7)) ? 2 : 1;
    var avalon_GMScriptHTML = "<p>The team has been formed, team members please vote to determind the result of this quest!<br>Quest ".concat(questNumber + 1, " fails if ").concat(failureVote, " failure vote(s) received.</p>");
    var avalon_charactersHTML = "<p>(GM should collect votes from members, failure vote(s) received: <input type=number value=0 min=0 max=".concat(Math.min(gameSet[playerNum - 5]["quests"][questNumber], playerNum - gameSet[playerNum - 5]["good"]), " id=\"fail\">)<br>\n    <button onclick=\"avalon_run(").concat(questNumber, ")\">Go!</button></p>");
    avalon_GMscript.innerHTML = avalon_GMScriptHTML;
    avalon_characters.innerHTML = avalon_charactersHTML;
    return;
}
function avalon_run(questNumber) {
    var failureVote = ((questNumber == 3) && (playerNum >= 7)) ? 2 : 1;
    var failure = document.getElementById("fail").value;
    if (failure >= failureVote) {
        questProgress.push(2);
    }
    else {
        questProgress.push(1);
    }
    var headerHTML = "<p>Player: ".concat(playerNum, "(Good ").concat(gameSet[playerNum - 5]["good"], "/Evil ").concat(playerNum - gameSet[playerNum - 5]["good"], ") Merlin is Player No.").concat(roleMerlinId, "<br>Current quest: ").concat(questNumber + 1, "</p>");
    headerHTML += "<br><fieldset><legend>Mission Status</legend>";
    var sucessNum = 0;
    for (var i = 0; questProgress[i]; ++i) {
        var progress = questProgress[i];
        headerHTML += "<p>Misson ".concat(i + 1, " \u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014 Result(").concat(progress < 2 ? "✔️" : "❌", ")</p>");
        sucessNum += progress < 2 ? 1 : 0;
    }
    headerHTML += "<br></fieldset>";
    avalon_header.innerHTML = headerHTML;
    var avalon_GMScriptHTML = "<p>Quest ended up with ".concat(failure < failureVote ? "success✔️" : "fail❌", "</p>");
    var fail = false;
    if (sucessNum >= 3) {
        avalon_GMScriptHTML += "<p>Three quests completed! The good side is about to win!<br>However, evil side have their last chance. Assassin, now you can try to point out Merlin!<br>Assassin pointed out: <input type=\"number\" min=1 max=".concat(playerNum, " id=\"merlin\"></p>");
        avalon_GMScriptHTML += "<p><button onclick=\"avalon_assassin()\">Next>></button></p>";
    }
    else if (questNumber + 1 - sucessNum >= 3) {
        fail = true;
        avalon_gameOver("Evil", "three quests failed");
    }
    else {
        avalon_GMScriptHTML += "<p>Discussion ended. Go to next team vote<button onclick=\"avalon_vote(".concat(questNumber + 1, ")\">Next>></button></p>");
    }
    if (!fail) {
        avalon_GMscript.innerHTML = avalon_GMScriptHTML;
        avalon_characters.innerHTML = "";
    }
}
function avalon_assassin() {
    var target = document.getElementById("merlin").value;
    if (target == roleMerlinId) {
        avalon_gameOver("Evil", "assassin killed Merlin");
    }
    else {
        avalon_gameOver("Good", "completed quests without exposing Merlin");
    }
}
function avalon_gameOver(winSide, reason) {
    if (reason === void 0) { reason = "none"; }
    var avalon_GMScriptHTML = "<p>".concat(winSide, " won for ").concat(reason, "!");
    avalon_GMscript.innerHTML = avalon_GMScriptHTML;
    var avalon_charactersHTML = "<p>Click <button onclick=\"avalon_reset()\">Restart</button></p>";
    avalon_characters.innerHTML = avalon_charactersHTML;
}
window.onload = function () {
    avalon_header = document.getElementById("header");
    avalon_GMscript = document.getElementById("gms");
    avalon_characters = document.getElementById("characters");
    avalon_reset();
    var spcsRefHTML = "<p><fieldset><legend>References for Special Roles</legend>";
    for (var i = 0; avalon_spCharacters[i]; ++i) {
        spcsRefHTML += "<button onclick=\"avalon_showExplaination('".concat(avalon_spCharacters[i]["name"], "')\">What is ").concat(avalon_spCharacters[i]["name"], "</button>         ");
    }
    spcsRefHTML += "</fieldset></p>";
    document.getElementById("charactersRef").innerHTML = spcsRefHTML;
};
