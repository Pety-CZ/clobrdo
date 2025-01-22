class Controller{
    #engine;
    #draw;


    constructor(engine, draw){
        this.#engine = engine;
        this.#draw = draw;

        this.#draw.bindDrawBoard(this.handleDrawBoard);
        // this.#draw.bindDrawFigure(this.handleDrawFigure);

    }

    handleDrawBoard = () => {
        this.#draw.drawGameBoard();
    }

}
