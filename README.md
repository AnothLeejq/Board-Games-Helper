# Board-Games-Helper
For walkthrough video of Werewolf Game GM Tool: https://www.loom.com/share/4c1c4aacdd4c43efa604a1c675359e87

## Main Introduction

Have you ever played board games like Werewolf as a GM? 
It's not a easy job, you need to know all the action order of those character and how their skills work. 
You also have to remember all the role of those players or you may miss some key steps of the game which lead to a invalid game.
Board Games Helper is a web-based tool, its target is to make GM job easier. This is a saver for non-professional player, even my cat can be a good GM of board games with this tool!
***Reminder: It's a GM tool and required physic items (e.g. a sort of cards) for board games to play. Only GM of the game need to see this interface.***

## Current progress

Werewolf: The main game flow is done, the games' log feature is coming. 

## How to set up

1. Download all the file and open "template/index.html" with your browser (Confirmed supported browser: Edge, Wavebrowser or Google Chrome).
2. Select the game you are going to player then set the key parameters applied for this game following the guide of the interface.
3. Enjoy your game :) You can host the game by only read the text shown in the interface and input the key value after your players make selections.

## Board Games supported

### Werewolf

Werewolf is a famous board game all around the world. For basic introduction of the rule please refer: https://playwerewolf.co/pages/rules

There are six special characters for now (Seer is a must in default so not included here): Witch, Hunter, Guard, White Wolf King, Wild Kid, Cupid.

**1. Before starting **

Before you start a game, you need to finish configuration. After finishing the configuration you'll have chance to confirm it.

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

+ **Request logs**: ***[Havn't finished!]*** You can click this button to request a log of last game including all the players' info, everyone's actions per day and night.
+ **Restart**: You can restart a new game and go back to configuration page.
