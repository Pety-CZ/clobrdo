import { Fig } from './Fig.js';
import { Dice } from './Dice.js';
import { Board } from './Board.js';


export class GameEngine{
    #board;
    #canvas;
    #ctx;
    #fig;
    #dice;
    #width;
    #height;
    #figSize;

    #draggingFig = null;
    #offsetX = 0;
    #offsetY = 0;


    #regexPlayer = /^P[1-6]$/;
    #regexHome = /^H[1-6]$/;
    #regexStart = /^S[1-6]$/;
    #regexFigure = /^F[1-6]$/;

    #colors = ["blue", "red", "yellow", "green", "purple", "black"];

    #figure_array = [];
 
    #maxPlayers;
    #gameDesk;
    

    #rows;
    #cols;


    constructor(canvas){
        console.log("GameEngine constructor");
        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext("2d");
        
        this.#dice = new Dice();
        
        this.#board = new Board();
        this.#gameDesk = this.#board.getGameDesk();

        this.checkCanvasSize();
        
        
        // old ENGINE
        
        // this.#rows = this.#gameDesk.length;
        // this.#cols = this.#gameDesk[0].length;
        // this.#maxPlayers = this.getMaxPlayers();
        // this.#figSize = this.#width / 2 / this.#cols;
        
        
        // console.log("Řádků: " + this.#gameDesk.length);
        // console.log("Sloupců: " + this.#gameDesk[0].length);
        // console.log("Max hráčů: " + this.#maxPlayers);
        
        // this.#figure_array.push(["P1", 5, 5]);
        this.drawGameBoard();
        this.createFigures();
        this.renderFigures();
    }
    
    checkCanvasSize(){
        let canvasSize = Math.min(this.#canvas.offsetWidth, this.#canvas.offsetHeight);
        this.#width = canvasSize;
        this.#height = canvasSize;
        this.#rows = this.#board.getRows();
        this.#cols = this.#board.getCols();
        this.#figSize = this.#width /2 / this.#cols; // Calculate here
        console.log("Cell size " + this.#figSize);
        console.log("Width: " + this.#width + " Height: " + this.#height);
    }

    createFigures(){
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let element = this.#gameDesk[i][j];
                if (element == "P1" || element == "P2" || element == "P3" || element == "P4"){
                    let color = element;
                    let x = this.#board.getCoordinates(j, this.#width);
                    let y = this.#board.getCoordinates(i, this.#height);
                    let size = this.#figSize * 0.5;
                    
                    let fig = new Fig(color, x, y, size, this.#colors);
                    this.#figure_array.push(fig);
                }
            }
        }
    }

    drawGameBoard() {
        this.#board.setColorScheme(this.#colors);
        this.#board.draw(this.#ctx, this.#width, this.#height, this.#colors);
    }

    renderFigures(){
        for(let i = 0; i < this.#figure_array.length; i++){
            let fig = this.#figure_array[i];
            fig.draw(this.#ctx);
        }
    }


    figurePickUp(event) {
        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Is mouse over any figure?
        const figure_array = this.#figure_array;
        for (let i = 0; i < figure_array.length; i++) {
            
            const fig = figure_array[i];
            
            const figSize = fig.getSize();
            const figX = fig.getX();
            const figY = fig.getY();

            // check if mouse is inside of figure radius
            if (Math.sqrt((x - figX) ** 2 + (y - figY) ** 2) < figSize) {
                fig.setOldPosition(figX, figY);
                this.#draggingFig = fig;
                this.#offsetX = x - figX;
                this.#offsetY = y - figY;
                break;
            }
        }
    }

    figureMove(event) {
        if (this.#draggingFig) {
            const rect = this.#canvas.getBoundingClientRect();
            const x = event.clientX - rect.left - this.#offsetX;
            const y = event.clientY - rect.top - this.#offsetY;

            const figSize = this.#draggingFig.getSize();

            this.#draggingFig.setX(x);
            this.#draggingFig.setY(y);

            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.drawGameBoard();
            this.renderFigures();
        }
    }


    getPlayerColor(player) {
        let number = player.slice(-1);
        return this.#colors[number - 1];
    }

    figureDrop(event) {

        if (this.#draggingFig) {
            // Get relative mouse coordinates between page and canvas
            const rect = this.#canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Calculate cell figSize of game board grid
            const fieldWidth = this.#width / this.#cols;
            const fieldHeight = this.#height / this.#rows;

            // Calculate the nearest cell coordinates
            // Using "floor" instead of "round", because it works more consistently
            const closestCol = Math.floor(x / fieldWidth);
            const closestRow = Math.floor(y / fieldHeight);


            // Calculate the center of the target cell
            const targetX = (closestCol + 0.5) * fieldWidth;
            const targetY = (closestRow + 0.5) * fieldHeight;

            // Snap the figure to the center of the nearest cell
            let dropPosition = this.#gameDesk[closestRow][closestCol];
            let dropPositionColor = this.getPlayerColor(dropPosition)
            let figColor = this.getPlayerColor(this.#draggingFig.getPlayer());

            let validMove;
 
            
            if (this.#regexHome.test(dropPosition) || this.#regexPlayer.test(dropPosition)) {   // Check if figure is placed in correct home
                if (dropPositionColor === figColor) {    // Snap the figure to the center of the correct home cell
                    this.#draggingFig.setX(targetX);
                    this.#draggingFig.setY(targetY);
                    console.log("Home field");
                    validMove = true;
                } else{
                    this.#draggingFig.resetOldPosition();
                    validMove = false;
                }
            } else if (dropPosition !== "0") {          // Check if figure is placed in correct start
                this.#draggingFig.setX(targetX);
                this.#draggingFig.setY(targetY);
                validMove = true;
            } else {
                this.#draggingFig.resetOldPosition();
                validMove = false;
            }

            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.drawGameBoard();
            this.renderFigures();
            (validMove) ? this.#dice.rollDice(): null;
        }
        this.#draggingFig = null;
    }
}
