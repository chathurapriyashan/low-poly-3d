import Ambient from "../lights/Ambient.js";
import Color from "./Color.js";

export default class Lights{
    /**
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    constructor(gl){
        this.gl = gl;
    }

    /**
     * 
     * @param {Color} color 
     * @returns {Ambient}
     */
    ambient(color){
        return new Ambient(this.gl , color);
    }
}