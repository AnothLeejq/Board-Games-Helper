const gamesList:string[] = ["Werewolf","Avalon"];

function addGame(name:string):void{
    let gameButtonHTML = `<p><a href = "../template/${name}.html" target="_blank">${name}</a></p>`;
    let newButton = document.createElement('p');
    newButton.innerHTML = gameButtonHTML;
    document.body.appendChild(newButton);
    return;
}

for(let i = 0;i<gamesList.length;i++){
    addGame(gamesList[i]);
}