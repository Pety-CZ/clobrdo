import { Draw } from './js/Draw.js';
import { Dice } from './js/Dice.js';

const canvas = document.getElementById("gameDesk");
// canvas.style.height = document.height;
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;



const draw = new Draw(canvas);
const dice = new Dice();

setListeners();




function setListeners(){
    console.log("setting up listeners...");

    // Canvas
    canvas.addEventListener('mousedown', (event) => draw.figurePickUp(event));
    canvas.addEventListener('mousemove', (event) => draw.figureMove(event));
    canvas.addEventListener('mouseup', (event) => draw.figureDrop(event));

    // Dice
    document.getElementById("diceSprite").addEventListener('click', () => dice.rollDice());
}
