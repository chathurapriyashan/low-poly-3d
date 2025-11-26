export default class Color{
    #colors = new Float32Array(4);

    /**
     * 
     * @param {number} r  - expected to be 0 - 1
     * @param {number} g  - expected to be 0 - 1
     * @param {number} b  - expected to be 0 - 1
     * @param {number} a  - expected to be 0 - 1
     */
    constructor (r , g , b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;

        this.#colors[0] = r;
        this.#colors[1] = g;
        this.#colors[2] = b;
        this.#colors[3] = a;

    }

    

    /**
     * 
     * @param {number} r - expected to be 0 - 255 
     * @param {number} g - expected to be 0 - 255 
     * @param {number} b - expected to be 0 - 255 
     * @returns {Color}
     */
    static rgb(r , g , b){
        return new Color(r/255 , g / 255 , b/255 , 1.0);
    }

    /**
     * 
     * @param {number} r - expected to be 0 - 255 
     * @param {number} g - expected to be 0 - 255 
     * @param {number} b - expected to be 0 - 255 
     * @param {number} a - expected to be 0 - 1 
     * @returns {Color}
     */
    static rgba(r , g , b , a){
        return new Color(r/255 , g / 255 , b/255 , a);
    }

    /**
     * 
     * @returns {Float32Array[4]}
     */
    float32(){
        return this.#colors;
    }

    static black = new Color(0.0 , 0.0 , 0.0 , 1.0);
    static white = new Color(1.0 , 1.0 , 1.0 , 1.0);
    static greenYellow = new Color(0.6784313725 , 1 , 0.1843137255 , 1.0);
}