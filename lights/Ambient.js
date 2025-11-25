import Color from "../base/Color.js";
import Light from "./Light.js";

export default class Ambient extends Light{
    /**
     * 
     * @param {Color} color 
     */
    constructor(gl , color){
        super(gl , color);
    }


}