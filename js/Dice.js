export class Dice{
    #DEBUG;
    #dice;
    #currentRoll;
    #SIDES;

    constructor(debug){
        this.#DEBUG = debug;
        this.#SIDES = 6;
        document.getElementById("dice").style.visibility = "visible";
        this.#dice = document.getElementById("diceSprite");
        document.getElementById("diceSprite").addEventListener('click', () => this.rollDice());
    }

    rollDice() {    
        this.#currentRoll = Math.floor(Math.random() * this.#SIDES) + 1;
        this.#dice.src = `images/dice_sprites/${this.#currentRoll}.png`
        console.log("Dice roll: " + this.#currentRoll);
    }

    getRoll(){
        return this.#currentRoll;
    }
}