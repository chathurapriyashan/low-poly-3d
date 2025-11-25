import Program from "./Program.js";
import * as glMatrix from "./../../node_modules/gl-matrix/esm/index.js";
import Vertical from "./Vertical.js";
import Color from "./Color.js";
import Ambient from "../lights/Ambient.js";
import Light from "../lights/Light.js";
import Lights from "./Lights.js";

export default class WebGl{
    /**
     * @type {WebGL2RenderingContext}
     */
    gl = undefined;
    VBOs = [];

    /**
     * @type {Program}
     */
    program = undefined;

    /**
     * @type {HTMLCanvasElement}
     */
    canvas = undefined;

    /**
     * @type {Lights}
     */
    lights = undefined;


    constructor(canvas){
        this.canvas = canvas;
        this.initGl();
    }

    static color = Color;

    init(){
        // this.createProgram();
        this.linkShaders();
    }

    initGl(){
        if(this.gl) return this.gl;
        this.gl = this.canvas.getContext('webgl2');
        this.glClear();
        this.createProgram();
        this.initLights();
        return this.gl;
    }

    initLights(){
        this.lights = new Lights(this.gl);
    }

    glClear(){
        this.gl.clearColor(0.0 , 0.0 , 0.0 , 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }

    createShader(shaderType , source){
        const shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader , source);
        this.gl.compileShader(shader);

        if(!this.gl.getShaderParameter(shader , this.gl.COMPILE_STATUS)){
            throw new Error(`${shaderType}: not compiled  ${this.gl.getShaderInfoLog(shader)}`);
        }

        return shader;
    }

    createProgram(){
        this.program = new Program(this.gl);
        return this.program;
    }

    enableDepth(depthType = this.gl.LEQUAL){
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(depthType);

    }

    createProjectionMatrix(fov=45 , zNear=0.1 , zFar=100 , aspectRatio=1){
        const radiantFov = fov * Math.PI / 180;
        const projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix , radiantFov , aspectRatio , zNear , zFar);
        return projectionMatrix;
    }


    createViewMatrix(){
        const viewMatrix = glMatrix.mat4.create(); 
        return viewMatrix;  
    }


    attachShader(shader){
        this.program.attachShader(shader);
    }

    linkShaders(){
        this.program.linkShaders();
    }

    glMatrix = glMatrix;


    vertical(x , y ,z){
        return new Vertical(x , y ,z);
    }

    /**
     * 
     * @param {number} r  - between 0 - 255
     * @param {number} g  - between 0 - 255
     * @param {number} b  - between 0 - 255
     * @param {number} a  - between 0 - 255
     */
    

    dataBuffer(points){
        let numberOfElements = 0;
        const data = points.map((p , i)=> {
            const pData =  p.float32();
            numberOfElements += pData.length;
            return [pData.length ,pData];
        });

        const dataArray = new Float32Array(numberOfElements);

        let currentProcessing = 0;
        data.forEach(p=>{
            const size = p[0];
            for(let i=0 ; i < size ; i++){
                dataArray[currentProcessing] = p[1][i];
                currentProcessing += 1;
            }
        });

        return dataArray;
    }
    

}
