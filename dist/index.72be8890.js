var gamesList = [
    "Werewolf",
    "Avalon"
];
function addGame(name) {
    var gameButtonHTML = '<a href = "../template/'.concat(name, '.html" target="_blank">').concat(name, "</a>");
    var newButton = document.createElement("p");
    newButton.innerHTML = gameButtonHTML;
    document.body.appendChild(newButton);
    return;
}
for(var i = 0; i < gamesList.length; i++)addGame(gamesList[i]);

//# sourceMappingURL=index.72be8890.js.map
