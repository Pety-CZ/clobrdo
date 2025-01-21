class Engine{
    #rows;
    #cols;
    #maxPlayers;
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

    constructor(){

        console.log("engine constructor");
        
        this.#rows = this.#gameDesk.length;
        this.#cols = this.#gameDesk[0].length;
        this.#maxPlayers = this.getMaxPlayers();

        console.log("Řádků: " +this.#gameDesk.length);
        console.log("Sloupců: " + this.#gameDesk[0].length);
        console.log("Max hráčů: " + this.#maxPlayers);

        this.drawGame();
    }
        
    getMaxPlayers(){
        let uniq = new Set();
        let regex = /^P[1-9]$/;
        for(let i = 0; i < this.#gameDesk.length; i++){
            for(let j = 0; j < this.#gameDesk[i].length; j++){
                let element = this.#gameDesk[i][j];
                if (regex.test(element))
                    uniq.add(this.#gameDesk[i][j]);
            }
        }
        return uniq.size;
    }

    drawGame(){
        let canvas = document.getElementById("gameDesk");
        let ctx = canvas.getContext("2d");

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        console.log("Canvas size: " + width + "x" + height);
        let cellSizeCoefficient = 0.8;
        width = width / this.#cols;
        height = height / this.#rows;
        console.log("Cell size: " + width + "x" + height);

        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                if (this.#gameDesk[i][j] != "0"){
                    console.log(this.#gameDesk[i][j]);
                    ctx.beginPath();
                    ctx.arc(i*width + width/2, j*height + height/2, width*cellSizeCoefficient/2, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }
    }














    
    loadLayoutFromForm(){
        document.getElementById('inputfile')
            .addEventListener('change', async function (event) {

                let fr = new FileReader();
                fr.onload = function () {
                    document.getElementById('output')
                        .textContent = fr.result;
                }

                // result = fr.readAsText(this.files[0]); 
                // const file = event.target.files[0];
                let result = await fr.readAsText(this.files[0]);
                console.log(result);
                return result;
            })
    }
}