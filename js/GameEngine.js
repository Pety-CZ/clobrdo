import { Fig } from './Fig.js';
import { Dice } from './Dice.js';
import { Board } from './Board.js';


export class GameEngine{
    #DEBUG;
    #board;
    #canvas;
    #db;
    #resetGame;
    #players;
    #player = 0;

    #ctx;
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
    #gameDesk;

    #rows;
    #cols;


    constructor(canvas, debug, db, resetGame, players){
        this.#resetGame = resetGame;
        this.#DEBUG = debug;
        (debug) ? console.log("GameEngine constructor") : null;
        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext("2d");
        
        this.#dice = new Dice();
        
        this.#db = db;

        this.#players = players;
    
        this.#board = new Board(debug, db, resetGame);
        this.#gameDesk = this.#board.getGameDesk();

        this.checkCanvasSize();
        (this.#resetGame) ? this.createFigures(this.#players) : this.loadFigures();
        this.#dice.setColor(this.#colors[this.#players[0]]);

        this.draw();
    }
    draw(){
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.drawGameBoard();
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

    async loadFigures(){
        try {
            const figs = await this.#db.getFigs(); // Use await to get the figures

            this.#figure_array = figs.map(figData => {
                let fig = new Fig(figData.player, figData.x_coord, figData.y_coord, figData.size, figData.color);
                fig.setId(figData.id);
                fig.setMoved(figData.hasMoved);
                return fig;
            });

            console.log("Figures loaded from DB:", this.#figure_array);
            this.draw(); // Call render after figures are loaded
        } catch (error) {
            console.error("Error loading figures:", error);
        }

    }
    createFigures(players){
        this.#players = players;
        this.#db.clearFigures();
        let id = 0;
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let field = this.#gameDesk[i][j];
                players.forEach(player => {
                    if (player == field){
                        console.log("Creating figure for player: " + player);
                        let color = this.getFieldColor(player);
                        let x = this.#board.getCoordinates(j, this.#width);
                        let y = this.#board.getCoordinates(i, this.#height);
                        let size = this.#figSize * 0.5;
                        let fig = new Fig(player, x, y, size, color);
                        fig.setId(id);
                        fig.setMoved(false);
                        this.#db.insertFig(id, player, x, y, size, color, fig.getMoved());
                        this.#figure_array.push(fig);
                        id++;
                    }
                });
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

            let validMove = false;

            if (this.#draggingFig.getMoved() == false){
                this.moveFigToStart(this.#draggingFig);
                validMove = true;
            } else if (this.#regexHome.test(dropPosition)){     // Check if figure is placed in correct home
                if (dropPositionColor === figColor) {           // Snap the figure to the center of the correct home cell
                    this.#draggingFig.setX(targetX);
                    this.#draggingFig.setY(targetY);
                    console.log("Home field");
                    validMove = true;
                } else{
                    validMove = false;
                }
            } else if (dropPosition !== "0") {          // Check if figure is placed in correct field (X, Sn, Hn)
                this.#draggingFig.setX(targetX);
                this.#draggingFig.setY(targetY);
                this.checkFieldForFigure();
                validMove = true;
            } else {
                validMove = false;
            }
            
            if (validMove){
                this.updateFigInDB(this.#draggingFig);
                (this.#DEBUG) ? console.log("Moved fig " + this.#draggingFig.getId() + " to " + targetX + "," + targetY) :null;
                if (this.#dice.getRoll() != 6){
                    this.#player = (this.#player + 1) % this.#players.length;
                    console.log("Player " + this.#player + " turn");
                    let color = this.#players[this.#player];
                    color = this.#colors[color.slice(-1) - 1];
                    this.#dice.setColor(color);
                } 
            } else{
                this.#draggingFig.resetOldPosition();
            }

            this.draw();
        }
        this.#draggingFig = null;
    }

    updateFigInDB(fig){
        this.#db.updateFig(fig.getId(), fig.getPlayer(), fig.getX(), fig.getY(), fig.getSize(), fig.getColor(), fig.getMoved());
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
                // (this.#DEBUG) ? console.log("Field value: " + fieldValue) : null;
                if (fieldValue == player){
                    (this.#DEBUG) ? console.log("Found field " + fieldValue) : null;
                    let fieldX = this.#board.getCoordinates(col, this.#width);
                    let fieldY = this.#board.getCoordinates(row, this.#height);
                    let isFieldEmpty = true;
                    for (let i = 0; i < this.#figure_array.length; i++){
                        let otherFig = this.#figure_array[i];
                        if (otherFig.getX() == fieldX && otherFig.getY() == fieldY){
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
                        this.updateFigInDB(fig);
                        return;
                    }
                }
            }
        }
        
    }
}
