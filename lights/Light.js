import Ambient from "./Ambient.js";
import Color from "../base/Color.js";

export default class Light{

    /**
     * @type {WebGL2RenderingContext}
     */
    gl = undefined;
    /**
     * 
     * @param {Color} color 
     */
    constructor( gl, color){
        this.color = color;
        this.gl = gl;
    }

    float32(){
        return this.color.float32();
    }

    apply(program , uniformName){
        const location = this.gl.getUniformLocation(program , uniformName);

        if(!location) throw new Error(`${uniformName} not found in program : ${program}`);

        this.gl.uniform4fv(location , this.float32());
    }


}

