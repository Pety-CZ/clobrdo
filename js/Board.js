export class Board{
    #DEBUG;
    #gameDesk = [
        ["P1", "P1", "0", "0", "X", "X", "S2", "0", "0", "P2", "P2"],
        ["P1", "P1", "0", "0", "X", "H2", "X", "0", "0", "P2", "P2"],
        ["0", "0", "0", "0", "X", "H2", "X", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "X", "H2", "X", "0", "0", "0", "0"],
        ["S1", "X", "X", "X", "X", "H2", "X", "X", "X", "X", "X"],
        ["X", "H1", "H1", "H1", "H1", "0", "H3", "H3", "H3", "H3", "X"],
        ["X", "X", "X", "X", "X", "H4", "X", "X", "X", "X", "S3"],
        ["0", "0", "0", "0", "X", "H4", "X", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "X", "H4", "X", "0", "0", "0", "0"],
        ["P4", "P4", "0", "0", "X", "H4", "X", "0", "0", "P3", "P3"],
        ["P4", "P4", "0", "0", "S4", "X", "X", "0", "0", "P3", "P3"]
    ];
    #cols;
    #rows;
    #cellSize;
    #maxPlayers;
    #colorScheme;

    #regexPlayer = /^P[1-6]$/;
    #regexHome = /^H[1-6]$/;
    #regexStart = /^S[1-6]$/;

    constructor(debug){
        this.#DEBUG = debug;
        (this.#DEBUG) ? console.log("Board constructor") : null;
        this.#rows = this.#gameDesk.length;
        this.#cols = this.#gameDesk[0].length;
        
        this.#maxPlayers = this.getMaxPlayers();

        if (this.#DEBUG) {
            console.log("Řádků: " + this.#gameDesk.length);
            console.log("Sloupců: " + this.#gameDesk[0].length);
            console.log("Max hráčů: " + this.#maxPlayers);
        }
    }
    
    getGameDesk(){
        return this.#gameDesk;
    }
    
    draw(ctx, width, height){
        // console.log("render board");
        this.#cellSize = width/ 2 / this.#cols;
        let fieldWidth = width / this.#cols;
        let fieldHeight = height / this.#rows;
        let cellSizeCoefficient = 0.8;
        let cellSize = this.#cellSize * cellSizeCoefficient;
        // console.log("Canvas cellSize: " + this.#width + "x" + this.#height);
        // console.log("Cell cellSize: " + fieldWidth + "x" + fieldHeight);
        // console.log("Field cellSize: " + this.#cellSize);

        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let field = this.#gameDesk[j][i];
                // console.log(field);
                if (field != "0") {
                    ctx.beginPath();
                    if (this.#regexPlayer.test(field)) {
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, cellSize / (cellSizeCoefficient / 0.9), 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = "black";
                        ctx.fill();
                        ctx.lineWidth = 4;
                    } else if (this.#regexHome.test(field)) {
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, cellSize, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = this.getPlayerColor(field);
                        ctx.lineWidth = cellSize / 2;
                    } else if (this.#regexStart.test(field)) {
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, cellSize, 0, 2 * Math.PI);
                        ctx.fillStyle = this.getPlayerColor(field);
                        ctx.strokeStyle = this.getPlayerColor(field);
                        ctx.lineWidth = cellSize / 4;
                        ctx.fillStyle = "lightgrey";
                        ctx.fill();
                    }
                    else if (field == "X") {
                        ctx.arc(i * fieldWidth + fieldWidth / 2, j * fieldHeight + fieldHeight / 2, cellSize, 0, 2 * Math.PI);
                        ctx.strokeStyle = "black";
                        ctx.fillStyle = "lightgrey";
                        ctx.fill();
                        ctx.lineWidth = cellSize / 8;
                    }
                    ctx.stroke();
                }
            }
        }

    }

    setColorScheme(colors){
        this.#colorScheme = colors;
    }

    getMaxPlayers() {
        let uniq = new Set();
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                let element = this.#gameDesk[i][j];
                if (this.#regexPlayer.test(element))
                    uniq.add(element);
            }
        }
        return uniq.size;
    }
    getPlayerColor(player) {
        let number = player.slice(-1);
        return this.#colorScheme[number - 1];
    }

    getCoordinates(c, length){
        let coordinate = c * (length / this.#cols) + (length / this.#cols) / 2;
        return coordinate;
    }
    getRows(){
        return this.#rows;
    }
    getCols(){
        return this.#cols;
    }

    getCellValue(cols, rows){
        return this.#gameDesk[cols][rows];
    }

}