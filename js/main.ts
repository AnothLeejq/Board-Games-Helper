const gamesList:string[] = ["Werewolf","Avalon"];

function addGame(name:string):void{
    let gameButtonHTML = `<a href = "../template/${name}.html" target="_blank">${name}</a>`;
    let newButton = document.createElement('p');
    newButton.innerHTML = gameButtonHTML;
    document.body.appendChild(newButton);
    return;
}

for(let i = 0;i<gamesList.length;i++){
    addGame(gamesList[i]);
}