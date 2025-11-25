import Ambient from "../lights/Ambient.js";
import Color from "./Color.js";

export default class Lights{
    constructor(gl){
        this.gl = gl;
    }

    /**
     * 
     * @param {Color} color 
     * @returns 
     */
    ambient(color){
        return new Ambient(this.gl , color);
    }
}