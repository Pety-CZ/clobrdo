export class Fig{
    #player;
    #oldX;
    #oldY;
    #x_pos;
    #y_pos;
    #size;

    constructor(player, x, y, size){
        this.#player = player;
        this.#x_pos = x;
        this.#y_pos = y;
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

    resetOldPosition(){
        this.#x_pos = this.#oldX;
        this.#y_pos = this.#oldY;
    }
    setOldPosition(x,y) {
        this.#oldX = x;
        this.#oldY = y;
    }

}