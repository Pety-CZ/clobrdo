class Engine{
    #drawer;
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
    #observers = []; // Array to hold observer functions

    constructor(drawer){
        this.#drawer = drawer;
        console.log("engine constructor");
        
        this.#rows = this.#gameDesk.length;
        this.#cols = this.#gameDesk[0].length;
        this.#maxPlayers = this.getMaxPlayers();

        console.log("Řádků: " +this.#gameDesk.length);
        console.log("Sloupců: " + this.#gameDesk[0].length);
        console.log("Max hráčů: " + this.#maxPlayers);

        // this.drawGame();
    }

    getGameDesk(){
        return this.#gameDesk;
    }
    getCols(){
        return this.#cols;
    }
    getRows(){
        return this.#rows;
    }
        
    updateGameDesk(newDesk) {
        this.#gameDesk = newDesk;
        this.notifyObservers(); // Notify observers of the change
    }

    addObserver(observer) {
        this.#observers.push(observer);
    }

    notifyObservers() {
        this.#observers.forEach(observer => observer());
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