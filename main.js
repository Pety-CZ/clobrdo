import { GameEngine } from './js/GameEngine.js';
import { DB } from './js/DB.js';
export class Main{
    #DEBUG = true;
    #canvas;
    #db;
    #ge;
    #players = [];
    constructor(){
        
        this.#canvas = document.getElementById("gameDesk");
        // this.#canvas.style.width = window.innerHeight;
        // this.#canvas.style.height = window.innerHeight;
        this.#canvas.style.width = window.clientHeight;
        this.#canvas.style.height = window.clientHeight;
        this.#canvas.style.visibility = "hidden";

        this.#db = new DB();
        // this.connectDB();
        this.#db.connect().then(() => {
            this.dbReady = true; // Flag to indicate DB is ready
            // Initialize GameEngine *after* DB connection is established
            // this.#ge = new GameEngine(this.#canvas, this.#DEBUG, this.#db, this.resetGame);
            // this.init(); // Call any necessary initialization methods *after* GameEngine setup

        }).catch(error => {
            console.error("Error connecting to DB:", error);
            // Handle the error appropriately (e.g., display message to the user)
        });

        const newGameBtn = document.getElementById("newGame");
        newGameBtn.addEventListener('click', () => {
            console.log("new game");
            // this.#ge = new GameEngine(this.#canvas, this.#DEBUG, this.#db, true);
            document.getElementById("gameStartOptions").style.visibility = "hidden";
            document.getElementById("playerSelect").style.visibility = "visible";
            // this.choosePlayers();
            // init();
            // ge.newGame();
        });

        const loadGameBtn = document.getElementById("loadGame");
        loadGameBtn.addEventListener('click', () => this.loadGame());


    }
    async connectDB(){
        await this.#db.connect();
    }




async setPlayers(players) {
    console.log("set players: " + players);
    this.#players = players;
    while (!this.dbReady){
        await new Promise(r => setTimeout(r, 10));
    }
    document.getElementById("playerSelect").style.visibility = "hidden";
    this.#ge = new GameEngine(this.#canvas, this.#DEBUG, this.#db, true, this.#players);
    this.init();

}

async loadGame() {
    console.log("load game");
    this.#ge = new GameEngine(this.#canvas, this.#DEBUG, this.#db, false);
    this.init();
}



init(players) {
    document.getElementById("gameDesk").style.visibility = "visible";
    document.getElementById("gameStartOptions").style.visibility = "hidden";
    this.setListeners();
}


setListeners() {
    (this.#DEBUG) ? console.log("setting up listeners...OK!") : null;

    // Canvas
    this.#canvas.addEventListener('mousedown', (event) => this.#ge.figurePickUp(event));
    this.#canvas.addEventListener('mousemove', (event) => this.#ge.figureMove(event));
    this.#canvas.addEventListener('mouseup', (event) => this.#ge.figureDrop(event));

    // Dice
    // document.getElementById("diceSprite").addEventListener('click', () => dice.rollDice());

}
}
const main = new Main();
