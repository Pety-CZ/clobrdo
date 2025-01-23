import { GameEngine } from './js/GameEngine.js';
import { Dice } from './js/Dice.js';

const canvas = document.getElementById("gameDesk");
// canvas.style.height = document.height;
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;



const ge = new GameEngine(canvas);
const dice = new Dice();

setListeners();




function setListeners(){
    console.log("setting up listeners...");

    // Canvas
    canvas.addEventListener('mousedown', (event) => ge.figurePickUp(event));
    canvas.addEventListener('mousemove', (event) => ge.figureMove(event));
    canvas.addEventListener('mouseup', (event) => ge.figureDrop(event));

    // Dice
    document.getElementById("diceSprite").addEventListener('click', () => dice.rollDice());
}
