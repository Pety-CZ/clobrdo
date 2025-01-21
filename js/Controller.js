class Controller{
    #engine;
    #draw;

    constructor(engine, draw){
        this.#engine = engine;
        this.#draw = draw;

        this.#draw.bindDrawGame(this.handleDrawGame);
    }

    handleDrawGame = () => {
        this.#draw.drawGame();
    }
}