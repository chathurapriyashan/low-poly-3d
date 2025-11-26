import Linter from "../lint/Linter.js";
import Color from "./Color.js";
import WebGl from "./Webgl.js";

export default class Canvas{
    /**
     * @type {HTMLCanvasElement}
     */
    #canvas = undefined;

    /**
     * @type {string} -expected id string without #symbol
     */
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

    /**
     * 
     * @param {string} id - -expected id string without #symbol
     */
    constructor(id){
        this.#id = id;
        this.init();
    }


    /**
     * 
     * @returns {number[]} [width , height]
     */
    getDims(){
        const canvasData = getComputedStyle(this.#canvas);
        this.width = Number.parseInt(canvasData.width);
        this.height = Number.parseInt(canvasData.height);
        return [this.width , this.height] 

    }

    /**
     * @param {number} width 
     * @param {number} height 
     */
    setDims(width , height){
        this.#canvas.width = width;
        this.#canvas.height = height;
    }

    /**
     * event listener for canvas resize
     */
    #handleResize(){
        const [width , height] = this.getDims();
        this.setDims(width , height);
        this.glClear();
    }


    init(){
        this.#canvas = document.getElementById(this.#id);
        this.gl = new WebGl(this.#canvas);
        if(!this.gl) throw new Error('webgl is not supported for this browser');

        //enable resize
        this.#handleResize();
        window.addEventListener('resize' , this.#handleResize.bind(this));
        this.getGl().viewport(0 ,0,this.width , this.height);
        this.gl.createProgram();

    }

    /**
     * clear canvas
     */
    glClear(){
        this.gl.glClear();
    }

    /**
     * @returns {WebGL2RenderingContext}
     */
    getGl(){
        return this.gl.gl;
    }

    /**
     * 
     * @returns {WebGLProgram}
     */
    getProgram(){
        return this.gl.program.program;
    }



    


    



}