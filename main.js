import { Draw } from './js/Draw.js';

const canvas = document.getElementById("gameDesk");
// canvas.style.height = document.height;
canvas.style.width = window.innerHeight;
canvas.style.height = window.innerHeight;



const draw = new Draw(canvas);

console.log("setting up listeners...");

canvas.addEventListener('mousedown', (event) => draw.figurePickUp(event));
canvas.addEventListener('mousemove', (event) => draw.figureMove(event));
canvas.addEventListener('mouseup', (event) => draw.figureDrop(event));
