# Board-Games-Helper
Walkthrough videos :

Werewolf Game GM Tool: https://www.loom.com/share/4c1c4aacdd4c43efa604a1c675359e87

Avalon GM Tool: https://www.loom.com/share/55d2e7180efe4fcbbfbc752f97d30f6f?sid=3e7681b7-a4e1-4d02-a6a8-9a68f00f0f10



## Main Introduction

Have you ever played board games like Werewolf as a GM? 
It's not a easy job, you need to know all the action order of those character and how their skills work. 
You also have to remember all the role of those players or you may miss some key steps of the game which lead to a invalid game.
Board Games Helper is a web-based tool, its target is to make GM job easier. This is a saver for non-professional player, even my cat can be a good GM of board games with this tool!
***Reminder: It's a GM tool and required physic items (e.g. a sort of cards) for board games to play. Only GM of the game need to see this interface.***

## Current progress

Werewolf: Game logs request & download is available now. 

## How to set up

1. Download all the file and open "template/index.html" with your browser (Confirmed supported browser: Edge, Wavebrowser or Google Chrome).
2. Select the game you are going to play then set the key parameters applied for this game following the guide of the interface.
3. Enjoy your game :) You can host the game by only read the text shown in the interface and input the key value after your players make selections.

## Board Games supported

### Werewolf

Werewolf is a famous board game all around the world. For basic introduction of the rule please refer: https://playwerewolf.co/pages/rules

There are six special characters for now (Seer is a must in default so not included here): Witch, Hunter, Guard, White Wolf King, Wild Kid, Cupid.

**1. Before starting**

Before you start a game, you need to finish configuration. After finishing the configuration you'll have chance to confirm it.

***You need to order and spread character cards following the order of the formed table.***

<img width="873" alt="1" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/78522e16-02ea-4d8a-9ecb-a623f33e4c01">

+ **Options of rule**: Define when will the werewolves win, and the winning condition of villagers is always eliminate all the werewolves.
+ **Players number**: You need to define how many players is joining the game, ***GM is not included***.
+ **Options of Special Roles**: Special rules are roles who have special skills rather than plain villagers or werewolves. Seer is a mandatory special role. Tick the checkbox to select the special role you want to join in this game.
+ **Intros of Special Roles**: Don't know or forget what they are? No worries! You can refer to the intros below any time to learn about those special roles!

**2. Night**

The game starts with a night. During the night, in default, werewolves attack a player and seer check a player once.

<img width="772" alt="2" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/2073f2e3-e57d-468e-981d-0b349c2df211">
<img width="860" alt="3" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/6bd65420-54de-4d9b-a8d5-d890020dcaf6">

+ **GM messages**: Messages for GM, you can host the game by only read every line of messages ***without brackets*** here.
+ **Players info**: This zone always list the real-time infomation of all the players. Including role, side, real-time status.
+ **Decisions input**: During the game you need to fill these blank when your players make their decisions (e.g. seer decide who to check), sometimes you must fill in the blank with a valid number of a player to go to next phase.

**3. Day**

The day comes when all the character finish there mandatory actions at night. During the day, in default, a player was found dead and a player will be voted to leave the game by others.


<img width="858" alt="4" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/820f894e-a542-4851-b7b5-e6921f8b8f7f">
<img width="868" alt="5" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/fc320940-652c-42d7-8647-7f6f5175f873">

+ **Skull icon & death**: The player with skull icon as he/her status stand for dead. Dead players can leave a last word to give infomation to living players. Last words are public to all the players, but after last word dead players can not do any action or say anything more.
+ **Wolf explode**: Any werewolf is able to explode before starting a vote. The wolf who explodes will claim that he/her is a werewolf and die right away. However, it will lead to instantly night so all the discussion and voting this day will be skipped.
+ **Vote**: If the discussion end, player should start to vote who to execute this day. Calculating the number of votes and find out who get the most votes is GM's job. Just input the number of player who gets the most vote, this player will die, leave last word and the next night will come.

**4. End**

The game ends when one of the end game condition is met. (e.g. all the werewolves were killed or voted out of the game)

<img width="854" alt="6" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/b07822ff-666e-45dd-8307-42fca984c655">
<img width="504" alt="7" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/2ac24eb0-e08a-42c1-bee6-ac70e7430336">


+ **Request logs**: You can click this button to request a log of last game including all the players' info, everyone's actions per day and night.
+ **Logs download**: Every game log can be downloaded as local document after requesting.
+ **Restart**: You can restart a new game and go back to configuration page.

### Avalon

Avalon (full name: Resistance Avalon) is a board game with the background of Arthur's legend. For basic introduction of the rule please refer: https://www.ultraboardgames.com/avalon/game-rules.php?utm_content=cmp-true

There are four extra characters can be added to the game: Percival, Mordred, Oberon and Morgana.

**1. Before starting**

Before you start a game, you need to finish configuration. After finishing the configuration you'll have chance to confirm it until you confirm the player number of Merlin.

***No need for give the players character cards in order, just spread it randomly.***

<img width="395" alt="1" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/118adeea-2ea4-4a76-ab34-9b9d34dbe56c">

+ **Player number**: Define the number of players, ***GM is not included***. Number of players should be 5-10, it affects the rule of the game, e.g. condition of quests.
+ **Options of special roles**: Tick the checkboxes to add extra roles to the game, you can click buttons below to confirm the infomation of each extra role.

**2. Role confirmation**

GM should read the GM scripts to tell the players what to do line by line and do not forget to wait for corresponding actions before reading last line.
During this phrase GM will need to input who Merlin is.

<img width="394" alt="2" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/ae664ecb-e4c0-47b0-a4ee-0017961e40c3">

+ **GM scripts**: The scripts that GM should read, ***(do not read the content inside the brackets like this)***.
+ **Merlin's id**: When Merlin open his eyes, GM should fill the id of Merlin in the blank and click button (confirm) to confirm the whole game's setting. To return to config page you should click (cancel).

**3. Quests**

The main part of the gameplay is forming groups and finishing quests.

<img width="400" alt="3" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/c4ef48bd-a7ba-48db-8460-5a663c209c5e">

+ **Team vote**: Before every quest start the player will need to be leader in turns and form a group with some players for the current quest. Then all the players have to vote for this idea (approve or reject). As the picture above mentioned, GM should click (approve) if the number of approve votes is more than those of reject votes, otherwise GM should click (Reject) to continue team vote and pass the leadership to next player.

<img width="395" alt="4" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/34006e9b-e81e-4494-b6b0-ab2306eb20ff">

+ **Quest vote**: After forming a group the current quest starts. GM should collect vote tokens from group members and input the number of reject votes are collected.

<img width="408" alt="5" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/fa1a6671-31f0-44fc-9f58-fc7f1701b75b">

+ **Quest results**: If the number of reject votes of a quest reach a exact number (normally 1), this quest will fail and it means that at least one of the players in this group belongs to evil as only players from evil side can vote for failure.

<img width="413" alt="6" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/2666d3a2-746e-4b0e-bc6b-76cdb5ed3990">

+ **Evils' last chance**: The goods win with three successful quests. However, the assassin from evil side will be revealed and he is going to name Merlin. GM should input the player number pointed out by assassin.

**4. End**

Good side wins the game with three completed quests and protecting Merlin from being identified by assassin.

Evil side wins the game if three quests failed, assassin identified Merlin, or five rejects in single team vote phrase.

+ **Restart**: You can restart a new game and go back to configuration page.


### Tick-Tack-Toe

This is a game without any other item requirements. Players can instantly play this game by taking actions in turns with this tool or do it via the third person.

**1. Before starting**

Two parameters are required to start a game. They are both 3 by default.

<img width="242" alt="1" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/b0c418eb-a573-4b44-a483-d635cc3e5c95">

+ **Size**: Defines the size of the grid. The grid is always a quare with the length of this number. It ranges from 3 to 10 (3<=size<=10).
+ **Target**: Defines the winning condition. The first player who links his/her chess into a line with such length horizontally, vertically or diagonally wins. This number is always no smaller than 3 and no larger than current size. (3<=target<=size).


**2. Game process&end**

Once finish the config the game starts and player holding round chess (O) always goes first. By clicking blank cells in the grid player can select which cell to put a chess this turn.

<img width="266" alt="2" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/3a7f4d0c-c217-4409-b441-401c98174034">

+ **Round**: The cell with blue color means that it is conquerred by player holding round chess.
+ **Cross**: The cell with red color means that it is conquerred by player holding cross chess.
+ **Preview**: The cell with yellow color means that it is selected temporarily by the player who is taking action this turn, player can change his/her mind before the 'confirm' button is clicked.
+ **Confirm**: Every player is required to put a chess in his/her turn. After making decision (one of the blank cells should be colored by yellow) player can click 'confirm' button to determind his/her decision and switch to next player.

<img width="225" alt="4" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/5829e732-44d3-44a2-a479-dffd71704479">

+ **Win&lose**: After each player confirms his/her selection, the system will check if any player meets the winning condition.
+ **Draw**: When the grid is full of chesses without player having reached winning condition, this game will end up with a draw.
+ **Restart**: Click the 'restart' button for a new game, previous configs will be saved as default for next game but you are still free to modify it.

**3. Further use**

You can not only play Tick-Tack-Toe with Tick-Tack-Toe helper! A game with 4-line, 5-line or any other custom rules can be played by your configs before starting.

<img width="331" alt="5" src="https://github.com/AnothLeejq/Board-Games-Helper/assets/68806149/18d9867b-07a7-4134-9b4c-1eadb26e084b">


