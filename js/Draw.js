class Draw{
    #engine;
    #cols;
    #rows;

    #regexPlayer = /^P[1-6]$/;
    #regexHome = /^H[1-6]$/;
    #regexStart = /^S[1-6]$/;

    #colors = ["blue", "red", "yellow", "green", "purple", "black"];
    
    constructor(engine){
        this.#engine = engine;
        this.#engine.addObserver(this.drawGame.bind(this));
        this.#cols = this.#engine.getCols();
        this.#rows = this.#engine.getRows();

    }

    drawGame() {
        const gameDesk = this.#engine.getGameDesk();
        console.log(gameDesk);
        document.getElementById("text").innerHTML = gameDesk;
        let canvas = document.getElementById("gameDesk");
        let ctx = canvas.getContext("2d");

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        console.log("Canvas size: " + width + "x" + height);
        width = width / this.#cols;
        height = height / this.#rows;
        let cellSizeCoefficient = 0.8;
        let size = width / 2 * cellSizeCoefficient;
        console.log("Cell size: " + width + "x" + height);

        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let field = gameDesk[j][i];
                if (field != "0") {
                    ctx.beginPath();
                    if(this.#regexPlayer.test(field)){
                        ctx.arc(i * width + width / 2, j * height + height / 2, size / (cellSizeCoefficient/0.9), 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.fill();
                        ctx.lineWidth = 4;
                    } else if (this.#regexHome.test(field)){
                        ctx.arc(i * width + width / 2, j * height + height / 2, size, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.fill();
                    } else if (this.#regexStart.test(field)){
                        ctx.arc(i * width + width / 2, j * height + height / 2, size, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.fill();
                    }
                    else
                        ctx.arc(i * width + width / 2, j * height + height / 2, size, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }
    }

    getPlayerColor(player){
        let number = player.slice(-1);
        return this.#colors[number - 1];
    }

    bindDrawGame(handler){
        document.getElementById("render").addEventListener('click', () => {
            handler();
        })
    }
}
