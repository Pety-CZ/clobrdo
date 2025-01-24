export class Dice{
    #DEBUG;
    #dice;
    #currentRoll;
    #SIDES;

    constructor(debug){
        this.#DEBUG = debug;
        this.#SIDES = 6;
        this.#dice = document.getElementById("diceSprite");
        document.getElementById("diceSprite").addEventListener('click', () => this.rollDice());
    }

    rollDice() {    
        this.#currentRoll = Math.floor(Math.random() * this.#SIDES) + 1;
        this.#dice.src = `sprites/dice/${this.#currentRoll}.png`
        console.log("Dice roll: " + this.#currentRoll);
    }

    getRoll(){
        return this.#currentRoll;
    }
}