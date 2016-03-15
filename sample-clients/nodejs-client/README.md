#Coveo Blitz 2016 - Node Starter Pack

##Installation
1. Node should already be installed on your computer. If not, heads to https://nodejs.org/en/download/
2. Type `npm install` to install the project dependencies

##Usage
Open the *config.json* file and replace `INSERT_TEAM_KEY_HERE` with your team key. The serverUrl might need to be modified, be sure that it **does not** end with a slash.

###Training
Simply type `npm test` or `node bot.js -t 1 config.json` to run your bot in training mode. This will start a new game on a random map with 3 bots moving randomly. 
It will also open your default browser to the game address. 

You can also use custom maps by using the `map` parameter. E.g., `node bot.js -t 1 --map m1 config.json`.

You can also specify the number of turns by using the `turns` parameter. E.g., `node bot.js -t 1 --turns 50 config.json` to use game of 50 turns.

The `t` parameter specify the number of runs, should always be 1.

You can kill the run at any moment with a *SIGINT*

##Evaluation Round
Be sure to be ready for the evaluation round. Use the provided VM.

We will provide you with a gameId that you'll need to queue for a game.

Replace `INSERT_GAME_ID_HERE` with the gameId in `node bot.js -a --id INSERT_GAME_ID_HERE config.json`

Don't leave the game or your bot will stay at its emplacement for the rest of the game.

##Additional Informations
The map parsing is already done for you. Feel free to modify it if you need to.
 
The files in the **client** folder shouldn't be modified. If you do modify them, we won't be responsible of what happens.  

Have fun!
