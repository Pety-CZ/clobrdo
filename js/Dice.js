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
        const animationDuration = 1000; // 1 second total animation time
        const fadeDuration = 200;      // 200ms for each fade (in/out)

        // 1. Fade Out
        this.#dice.style.opacity = 0;  // Set opacity to 0 to start fade out

        // 2. Wait for fade out to complete, then change image and fade in
        setTimeout(() => {
            //Change image source during fade out.
            this.#currentRoll = Math.floor(Math.random() * this.#SIDES) + 1;
            this.#dice.src = `images/dice_sprites/${this.#currentRoll}.png`;

            this.#dice.style.opacity = 1; // Fade in
            setTimeout(() => {
                console.log("Dice roll:", this.#currentRoll);

            }, fadeDuration);



        }, fadeDuration);



    }

    // rollDice() {    
    //     this.#currentRoll = Math.floor(Math.random() * this.#SIDES) + 1;
    //     this.#dice.src = `images/dice_sprites/${this.#currentRoll}.png`
    //     console.log("Dice roll: " + this.#currentRoll);
    // }

    getRoll(){
        return this.#currentRoll;
    }
    setColor(color){
        const diceDiv = document.getElementById("dice");
        diceDiv.style.backgroundColor = color;
    }
}