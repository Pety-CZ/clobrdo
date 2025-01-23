import { Draw } from './js/Draw.js';

const canvas = document.getElementById("gameDesk");
canvas.style.height = document.height;


const draw = new Draw(canvas);

// draw.drawGameBoard();