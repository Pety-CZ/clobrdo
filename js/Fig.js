export class Fig{
    #player;
    #x_pos;
    #y_pos;
    #size;

    constructor(player, x_pos, y_pos, size){
        this.#player = player;
        this.#x_pos = x_pos;
        this.#y_pos = y_pos;
        this.#size = size;
    }

    getPlayer(){
        return this.#player;
    }
    getX(){
        return this.#x_pos;
    }
    getY(){
        return this.#y_pos;
    }
    getSize(){
        return this.#size;
    }

    setX(x){
        this.#x_pos = x;
    }
    setY(y){
        this.#y_pos = y;
    }
}