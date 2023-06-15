var gamesList = ["Werewolf", "Avalon", "TickTackToe"];
function addGame(name) {
    var gameButtonHTML = "<p><a href = \"../template/".concat(name, ".html\" target=\"_blank\">").concat(name, "</a></p>");
    var newButton = document.createElement('p');
    newButton.innerHTML = gameButtonHTML;
    document.body.appendChild(newButton);
    return;
}
for (var i = 0; i < gamesList.length; i++) {
    addGame(gamesList[i]);
}
