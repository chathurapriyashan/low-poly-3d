export default class Vertical{
    #verticals = new Float32Array(3);

    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;

        this.#verticals[0] = x;
        this.#verticals[1] = y;
        this.#verticals[2] = z;
    }

    float32(){
        return this.#verticals;
    }


}