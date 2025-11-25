import Linter from "../lint/Linter.js";
import Color from "./Color.js";
import WebGl from "./Webgl.js";

export default class Canvas{
    /**
     * @type {HTMLCanvasElement}
     */
    #canvas = undefined;
    #id = undefined;
    width = 0;
    height = 0;
    static lint = Linter;
    link = Linter;

    /**
     * @type {WebGl}
     */
    gl = undefined;

    color = Color;
    static color = Color;

    constructor(id){
        this.#id = id;
        this.init();
    }

    getDims(){
        const canvasData = getComputedStyle(this.#canvas);
        this.width = Number.parseInt(canvasData.width);
        this.height = Number.parseInt(canvasData.height);
        return [this.width , this.height] 

    }

    setDims(width , height){
        this.#canvas.width = width;
        this.#canvas.height = height;
    }

    #handleResize(){
        const [width , height] = this.getDims();
        this.setDims(width , height);
        this.glClear();
    }

    init(){
        this.#canvas = document.getElementById('canvas');
        this.gl = new WebGl(this.#canvas);
        if(!this.gl) throw new Error('webgl is not supported for this browser');

        //enable resize
        this.#handleResize();
        window.addEventListener('resize' , this.#handleResize.bind(this));
        this.getGl().viewport(0 ,0,this.width , this.height);
        this.gl.createProgram();

    }

    glClear(){
        this.gl.glClear();
    }

    getGl(){
        return this.gl.gl;
    }


    getProgram(){
        return this.gl.program.program;
    }



    


    



}