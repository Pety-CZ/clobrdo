import { Fig } from './Fig.js';
import { Dice } from './Dice.js';
import { Board } from './Board.js';


export class GameEngine{
    #DEBUG;
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


    constructor(canvas, debug){
        this.#DEBUG = debug;
        (debug) ? console.log("GameEngine constructor") : null;
        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext("2d");
        
        this.#dice = new Dice();
        
        this.#board = new Board(debug);
        this.#gameDesk = this.#board.getGameDesk();

        this.checkCanvasSize();
        
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
        if (this.#DEBUG) {
            console.log("Cell size " + this.#figSize);
            console.log("Width: " + this.#width + " Height: " + this.#height);
        }
    }

    createFigures(){
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let player = this.#gameDesk[i][j];
                if (player == "P1" || player == "P2" || player == "P3" || player == "P4"){
                    let color = this.getFieldColor(player);
                    let x = this.#board.getCoordinates(j, this.#width);
                    let y = this.#board.getCoordinates(i, this.#height);
                    let size = this.#figSize * 0.5;
                    let fig = new Fig(player, x, y, size, color);
                    fig.setMoved(false);
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


    getFieldColor(field) {
        let number = field.slice(-1);
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
            let dropPositionColor = this.getFieldColor(dropPosition);
            let figColor = this.#draggingFig.getColor();

            let validMove;

            if (this.#draggingFig.getMoved() == false){
                this.moveFigToStart(this.#draggingFig);
            } else if (this.#regexHome.test(dropPosition)){     // Check if figure is placed in correct home
                if (dropPositionColor === figColor) {           // Snap the figure to the center of the correct home cell
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
                this.checkFieldForFigure();
                validMove = true;
            } else {
                this.#draggingFig.resetOldPosition();
                validMove = false;
            }

            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.drawGameBoard();
            this.renderFigures();
        }
        this.#draggingFig = null;
    }

    moveFigToStart(fig){
        for (let x = 0; x < this.#rows; x++) {
            for (let y = 0; y < this.#cols; y++) {
                let field = this.#gameDesk[y][x];
                let startField =  this.#regexStart.test(field)
                if (startField && this.getFieldColor(field) == fig.getColor()){
                    fig.setMoved(true);
                    fig.setX(this.#board.getCoordinates(x, this.#width));
                    fig.setY(this.#board.getCoordinates(y, this.#height));
                    this.checkFieldForFigure();
                    return;
                }
            }
        }
    }


    // If figure is dropped on another figure
    // if so, kick old figure and move it to player
    checkFieldForFigure(){
        for(let i = 0; i < this.#figure_array.length; i++){
            let kickFig = this.#figure_array[i];
            let newFig = this.#draggingFig;

            if (kickFig.getX() == newFig.getX() && kickFig.getY() == newFig.getY() && kickFig != newFig){
                (this.#DEBUG) ? console.log("Kicking figure: " + kickFig.getPlayer() +", " + kickFig.getX() + " " + kickFig.getY() + " ...") : null;
                this.kickFigure(kickFig);
            }
        }
    }
    kickFigure(fig){
        // Look for empty Pn field
        // =====> get Pn(X,Y) from board, compare fig_array if there is any figure on this position
        // =====> if yes, move it there
        let player = fig.getPlayer();
        (this.#DEBUG) ? console.log("Looking for empty home field of player " + player) : null;
        for(let row = 0; row < this.#rows; row++){
            for(let col = 0; col < this.#cols; col++){
                let fieldValue = this.#board.getCellValue(row, col);
                console.log("Field value: " + fieldValue);
                if (fieldValue == player){
                    (this.#DEBUG) ? console.log("Found field " + fieldValue) : null;
                    let fieldX = this.#board.getCoordinates(col, this.#width);
                    let fieldY = this.#board.getCoordinates(row, this.#height);
                    let isFieldEmpty = true;
                    for (let i = 0; i < this.#figure_array.length; i++){
                        let testFig = this.#figure_array[i];
                        if (testFig.getX() == fieldX && testFig.getY() == fieldY){
                            // field is not empty
                            isFieldEmpty = false;
                            break;
                        }
                    }
                    if (isFieldEmpty){
                        (this.#DEBUG) ? console.log("Field " + fieldValue + " IS EMPTY, MOVING FIG!") : null;
                        fig.setX(fieldX);
                        fig.setY(fieldY);
                        fig.setMoved(false);
                        return;
                    }
                }
            }
        }
        
    }
}
