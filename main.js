import { GameEngine } from './js/GameEngine.js';
import { DB } from './js/DB.js';

const DEBUG = true;

const canvas = document.getElementById("gameDesk");
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;
canvas.style.visibility = "hidden";

const newGameBtn = document.getElementById("newGame");
const loadGameBtn = document.getElementById("loadGame");

const db = new DB();
await db.connect();

var ge;

newGameBtn.addEventListener('click', () => {
    console.log("new game");
    ge = new GameEngine(canvas, DEBUG, db, true);
    init();
    // ge.newGame();
});

loadGameBtn.addEventListener('click', () => {
    console.log("load game");
    ge = new GameEngine(canvas, DEBUG, db, false);
    
    init();
    // ge.loadGame();

});

function init(){
    document.getElementById("gameDesk").style.visibility = "visible";
    document.getElementById("gameStartOptions").style.visibility = "hidden";
    setListeners();
}




function setListeners(){
    (DEBUG) ? console.log("setting up listeners...OK!"): null;

    // Canvas
    canvas.addEventListener('mousedown', (event) => ge.figurePickUp(event));
    canvas.addEventListener('mousemove', (event) => ge.figureMove(event));
    canvas.addEventListener('mouseup', (event) => ge.figureDrop(event));

    // Dice
    // document.getElementById("diceSprite").addEventListener('click', () => dice.rollDice());
    
}
