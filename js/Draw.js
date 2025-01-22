import { Fig } from './Fig.js';
export class Draw{
    #engine;
    #canvas;
    #ctx;
    #fig;
    #cols;
    #rows;
    #width;
    #height;
    #size;

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
    #gameDesk = [
        ["P1", "P1", "0", "0", "X", "X", "S2", "0", "0", "P2", "P2"],
        ["P1", "P1", "0", "0", "X", "H2", "X", "0", "0", "P2", "P2"],
        ["0", "0", "0", "0", "X", "H2", "X", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "X", "H2", "X", "0", "0", "0", "0"],
        ["S1", "X", "X", "X", "X", "H2", "X", "X", "X", "X", "X"],
        ["X", "H1", "H1", "H1", "H1", "F3", "H3", "H3", "H3", "H3", "X"],
        ["X", "X", "X", "X", "X", "H4", "X", "X", "X", "X", "S3"],
        ["0", "0", "0", "0", "X", "H4", "X", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "X", "H4", "X", "0", "0", "0", "0"],
        ["P4", "P4", "0", "0", "X", "H4", "X", "0", "0", "P3", "P3"],
        ["P4", "P4", "0", "0", "S4", "X", "X", "0", "0", "P3", "P3"]
    ];
    
    constructor(canvas){
        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext("2d");

        this.#width = this.#canvas.offsetWidth;
        this.#height = this.#canvas.offsetHeight;

        
        this.#canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.#canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.#canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        
          
        // ENGINE
        console.log(" old engine constructor");
        
        this.#rows = this.#gameDesk.length;
        this.#cols = this.#gameDesk[0].length;
        this.#maxPlayers = this.getMaxPlayers();
        this.#size = this.#width / 2 / this.#cols;


        console.log("Řádků: " + this.#gameDesk.length);
        console.log("Sloupců: " + this.#gameDesk[0].length);
        console.log("Max hráčů: " + this.#maxPlayers);

        // this.#figure_array.push(["P1", 5, 5]);
        this.createFigures();
        this.drawGameBoard();
    }

    getMaxPlayers() {
        let uniq = new Set();
        let regex = /^P[1-9]$/;
        for (let i = 0; i < this.#gameDesk.length; i++) {
            for (let j = 0; j < this.#gameDesk[i].length; j++) {
                let element = this.#gameDesk[i][j];
                if (regex.test(element))
                    uniq.add(this.#gameDesk[i][j]);
            }
        }
        return uniq.size;
    }
    createFigures(){
        for (let i = 0; i < this.#gameDesk.length; i++) {
            for (let j = 0; j < this.#gameDesk[i].length; j++) {
                let element = this.#gameDesk[i][j];
                if (element == "P1" || element == "P2" || element == "P3" || element == "P4"){
                    let color = element;
                    let x = j;
                    let y = i;
                    let size = this.#size * 0.5;
                    // this.#figure_array.push([color, x, y]);
                    this.#figure_array.push(new Fig(color, x, y, size));

                }
            }
        }
    }

    getSize(){
        return this.#size;
    }

    drawGameBoard() {
        // const gameDesk = this.#engine.getGameDesk();
        // console.log(gameDesk);
        
        // let canvas = document.getElementById("gameDesk");
        // let ctx = canvas.getContext("2d");

        let ctx = this.#ctx;
        let fieldWidth = this.#width / this.#cols;
        let fieldHeight = this.#height / this.#rows;
        let cellSizeCoefficient = 0.8;
        let size = this.#size * cellSizeCoefficient;
        // console.log("Canvas size: " + this.#width + "x" + this.#height);
        // console.log("Cell size: " + fieldWidth + "x" + fieldHeight);
        // console.log("Field size: " + this.#size);
        
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let field = this.#gameDesk[j][i];
                if (field != "0") {
                    ctx.beginPath();
                    if(this.#regexPlayer.test(field)){
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, size / (cellSizeCoefficient/0.9), 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = "black";
                        ctx.fill();
                        ctx.lineWidth = 4;
                    } else if (this.#regexHome.test(field)){
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, size, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = this.getPlayerColor(field);
                        ctx.lineWidth = 12;
                        // ctx.fill();
                    } else if (this.#regexStart.test(field)){
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, size, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = this.getPlayerColor(field);
                        ctx.lineWidth = 12;
                        ctx.fillStyle = "lightgrey";
                        ctx.fill();
                        // ctx.fill();
                    }
                    else if (field == "X"){
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, size, 0, 2 * Math.PI);
                        ctx.strokeStyle = "black";
                        ctx.fillStyle = "lightgrey";
                        ctx.fill();
                        ctx.lineWidth = 4;
                    }
                    ctx.stroke();
                }
            }
        }
        this.drawFigures();
    }

    drawFigures(){
        // console.log(vardump(this.#engine.figure_array));
        let ctx = this.#ctx;
        let figure_array = this.#figure_array;
        for (let i = 0; i < figure_array.length; i++) {
            // for (let j = 0; j < figure_array[i].length; j++) {
                let fig = figure_array[i];
                let size = fig.getSize();

                let player = fig.getPlayer();
                let x = fig.getX() * (this.#width / this.#cols) + (this.#width / this.#cols)/2;
                let y = fig.getY() * (this.#height / this.#rows) + (this.#width / this.#cols) / 2;

                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI);
                ctx.fillStyle = this.getPlayerColor(player);
                ctx.fill();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 10;
                ctx.stroke();
        }
        
    }

    getPlayerColor(player){
        let number = player.slice(-1);
        return this.#colors[number - 1];
    }




    onMouseDown(event) {
        const rect = this.#canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const figure_array = this.#figure_array;
        for (let i = 0; i < figure_array.length; i++) {
            
            const fig = figure_array[i];
            const size = fig.getSize(); // Velikost figurky
            const figX = fig.getX() * (this.#width / this.#cols) + (this.#width / this.#cols) / 2 - size;
            const figY = fig.getY() * (this.#height / this.#rows) + (this.#height / this.#rows) / 2 - size;

            if (Math.sqrt((x - figX) ** 2 + (y - figY) ** 2) < size) {
                this.#draggingFig = fig;
                this.#offsetX = x - figX;
                this.#offsetY = y - figY;
                break;
            }
        }
    }

    onMouseMove(event) {
        if (this.#draggingFig) {
            const rect = this.#canvas.getBoundingClientRect();
            const x = event.clientX - rect.left - this.#offsetX;
            const y = event.clientY - rect.top - this.#offsetY;

            const figSize = this.#draggingFig.getSize();

            this.#draggingFig.setX( (x - figSize ) / (this.#width / this.#cols) );
            this.#draggingFig.setY( (y - figSize ) / (this.#height / this.#rows) );

            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.drawGameBoard();
            this.drawFigures();
        }
    }

    onMouseUp(event) {
        this.#draggingFig = null;
    }

















    bindDrawBoard(handler){
        document.getElementById("render").addEventListener('click', () => {
            handler();
        })
        document.addEventListener(onload, () => {
            handler();
        })
    }
}
