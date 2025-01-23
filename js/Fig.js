export class Fig{
    #player;
    #oldX;
    #oldY;
    #x_pos;
    #y_pos;
    #size;
    #colorscheme;

    constructor(player, x, y, size, colors){
        this.#player = player;
        this.#x_pos = x;
        this.#y_pos = y;
        this.#size = size;
        this.#colorscheme = colors;
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

    draw(ctx){
        let player = this.#player
        let x = this.#x_pos;
        let y = this.#y_pos;
        let size = this.#size
        let color = this.figColor(player);

        // console.log("fig at (" + x + "," + y + ") with color " + color + " and size " + size);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = size / 2;
        ctx.stroke();

    }

    figColor(player){
        let number = player.slice(-1);
        return this.#colorscheme[number - 1];
    }
    setColorScheme(colors){
        this.#colorscheme = colors;
    }
}
