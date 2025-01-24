export class Fig{
    #player;        // P1, P2...
    #oldX;          // position for returning fig from invalid placed position
    #oldY;
    #x_pos;         // current position
    #y_pos;
    #size;          // size in pixels
    #color;   // array of colors saved in GameEngine
    #moved = false;

    constructor(player, x, y, size, color){
        this.#player = player;
        this.#x_pos = x;
        this.#y_pos = y;
        this.#size = size;
        this.#color = color;
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
    getColor(){
        return this.#color;
    }

    setX(x){
        this.#x_pos = x;
    }
    setY(y){
        this.#y_pos = y;
    }
    setMoved(value){
        this.#moved = value;
    }
    getMoved(){
        return this.#moved;
    }

    resetOldPosition(){
        this.#x_pos = this.#oldX;
        this.#y_pos = this.#oldY;
    }
    setOldPosition(x,y) {
        this.#oldX = x;
        this.#oldY = y;
    }

    draw(ctx){
        let x = this.#x_pos;
        let y = this.#y_pos;
        let size = this.#size
        let color = this.#color;
        // (this.#DEBUG) ? console.log("Drawing fig of player " + player + " at (" + x + "," + y + ") with color " + color + " and size " + size) : null;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = size / 2;
        ctx.stroke();
    }
}
