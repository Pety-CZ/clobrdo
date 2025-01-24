import { GameEngine } from './js/GameEngine.js';
import { Dice } from './js/Dice.js';

const canvas = document.getElementById("gameDesk");
// canvas.style.height = document.height;
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;


const DEBUG = true;
const ge = new GameEngine(canvas, DEBUG);
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
