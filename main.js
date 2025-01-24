import { GameEngine } from './js/GameEngine.js';
import { DB } from './js/DB.js';

const DEBUG = true;

const canvas = document.getElementById("gameDesk");
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;



const db = new DB();
await db.connect();




const ge = new GameEngine(canvas, DEBUG, db);
// const dice = new Dice(DEBUG);

setListeners();




function setListeners(){
    (DEBUG) ? console.log("setting up listeners...OK!"): null;

    // Canvas
    canvas.addEventListener('mousedown', (event) => ge.figurePickUp(event));
    canvas.addEventListener('mousemove', (event) => ge.figureMove(event));
    canvas.addEventListener('mouseup', (event) => ge.figureDrop(event));

    // Dice
    // document.getElementById("diceSprite").addEventListener('click', () => dice.rollDice());
    
}
