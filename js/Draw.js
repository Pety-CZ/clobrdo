class Draw{
    #engine;
    #canvas;
    #ctx;
    #fig;
    #cols;
    #rows;
    #width;
    #height;
    #size;
    #gameDesk;

    #draggingFig = null;
    #offsetX = 0;
    #offsetY = 0;


    #regexPlayer = /^P[1-6]$/;
    #regexHome = /^H[1-6]$/;
    #regexStart = /^S[1-6]$/;
    #regexFigure = /^F[1-6]$/;

    #colors = ["blue", "red", "yellow", "green", "purple", "black"];
    
    constructor(engine, fig){
        this.#engine = engine;
        this.#fig = fig;
        this.#engine.addObserver(this.drawGameBoard.bind(this));
        this.#cols = this.#engine.getCols();
        this.#rows = this.#engine.getRows();

        this.#gameDesk = this.#engine.getGameDesk();
        this.#canvas = document.getElementById("gameDesk");
        this.#ctx = this.#canvas.getContext("2d");

        this.#width = this.#canvas.offsetWidth;
        this.#height = this.#canvas.offsetHeight;
        this.#size = this.#width / 2 / this.#cols;

     
    }

    drawGameBoard() {
        // const gameDesk = this.#engine.getGameDesk();
        console.log(gameDesk);
        
        // let canvas = document.getElementById("gameDesk");
        // let ctx = canvas.getContext("2d");

        // let width = canvas.offsetWidth;
        // let height = canvas.offsetHeight;
        // width = width / this.#cols;
        // height = height / this.#rows;
        let ctx = this.#ctx;
        let width = this.#width / this.#cols;
        let height = this.#height / this.#rows;
        let cellSizeCoefficient = 0.8;
        let size = this.#size * cellSizeCoefficient;
        console.log("Canvas size: " + width + "x" + height);
        console.log("Cell size: " + width + "x" + height);

        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let field = this.#gameDesk[j][i];
                if (field != "0") {
                    ctx.beginPath();
                    if(this.#regexPlayer.test(field)){
                        ctx.arc(i * width + width / 2, j * height + height / 2, size / (cellSizeCoefficient/0.9), 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = "black";
                        ctx.fill();
                        ctx.lineWidth = 4;
                    } else if (this.#regexHome.test(field)){
                        ctx.arc(i * width + width / 2, j * height + height / 2, size, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = this.getPlayerColor(field);
                        ctx.lineWidth = 12;
                        // ctx.fill();
                    } else if (this.#regexStart.test(field)){
                        ctx.arc(i * width + width / 2, j * height + height / 2, size, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = this.getPlayerColor(field);
                        ctx.lineWidth = 12;
                        // ctx.fill();
                    }
                    else if (field == "X"){
                        ctx.arc(i * width + width / 2, j * height + height / 2, size, 0, 2 * Math.PI);
                        ctx.strokeStyle = "black";
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
        let figure_array = this.#engine.getFigures();
        for (let i = 0; i < figure_array.length; i++) {
            // for (let j = 0; j < figure_array[i].length; j++) {

                let size = this.#size * 0.5;

                console.log("Fig:" + figure_array[i][0] + ", " + figure_array[i][1] + ", " + figure_array[i][2]);
                let player = figure_array[i][0];
                let x = figure_array[i][1] * (this.#width / this.#cols) + (this.#width / this.#cols)/2;
                let y = figure_array[i][2] * (this.#height / this.#rows) + (this.#width / this.#cols) / 2;

                console.log("Drawing figure: " + player + " at " + x + "x" + y);

                ctx.beginPath();
                ctx.arc(x, y, size, 0, 2 * Math.PI);
                ctx.fillStyle = this.getPlayerColor(player);
                ctx.fill();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 10;
                ctx.stroke();
                // this.#engine.setFigure(color, x, y);
            // }
        }
        
    }

    getPlayerColor(player){
        let number = player.slice(-1);
        return this.#colors[number - 1];
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
