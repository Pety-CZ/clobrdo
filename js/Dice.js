export class Dice{
    #SIDES = 6;
    #currentRoll;

    constructor(){
    }

    rollDice(){
        this.#currentRoll = Math.floor(Math.random() * this.#SIDES) + 1;
        console.log("Dice roll: " + this.#currentRoll);
        return this.#currentRoll;
    }

    getSide(){
        return this.#currentRoll;
    }
}