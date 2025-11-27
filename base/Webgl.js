import Program from "./Program.js";
import * as glMatrix from "gl-matrix";
import Vertical from "./Vertical.js";
import Color from "./Color.js";
import Ambient from "../lights/Ambient.js";
import Light from "../lights/Light.js";
import Lights from "./Lights.js";


const cameraPositions = {
    x : 0 , 
    y : 0 , 
    z : 3,
}

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


    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas){
        this.canvas = canvas;
        this.initGl();
    }

    static color = Color;

    init(){
        // this.createProgram();
        this.linkShaders();
    }

    /**
     * 
     * @returns {WebGL2RenderingContext}
     */
    initGl(){
        if(this.gl) return this.gl;
        this.gl = this.canvas.getContext('webgl2');
        this.glClear();
        this.createProgram();
        this.initLights();
        return this.gl;
    }

    /**
     * @description create light collections and  enable all default lightings
     */
    initLights(){
        this.lights = new Lights(this.gl);
    }

    /**
     * @description clear all canvas data
     */
    glClear(){
        this.gl.clearColor(0.0 , 0.0 , 0.0 , 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }

    /**
     * 
     * @param {WebGLShaderPrecisionFormat} shaderType 
     * @param {string} source 
     * @returns {WebGLShader}
     */
    createShader(shaderType , source){
        const shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader , source);
        this.gl.compileShader(shader);

        if(!this.gl.getShaderParameter(shader , this.gl.COMPILE_STATUS)){
            throw new Error(`${shaderType}: not compiled  ${this.gl.getShaderInfoLog(shader)}`);
        }

        return shader;
    }

    /**
     * 
     * @returns {Program}
     */
    createProgram(){
        this.program = new Program(this.gl);
        return this.program;
    }

    /**
     * 
     * @param {number} depthType 
     */
    enableDepth(depthType = this.gl.LEQUAL){
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(depthType);

    }

    /**
     * 
     * @param {number} fov  - expected in degrees (optional)
     * @param {number} zNear  - zNear must be greater than 0
     * @param {number} zFar  - zFar must be greater than 0 and zNear value
     * @param {number} aspectRatio - canvas.width / canvas.height
     * @returns {mat4}
     */
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


    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Vertical}
     */
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
    

    /**
     * 
     * @param {Float32Array[][]} points 
     * @returns {Float32Array}
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


    /**
     * 
     * @param {number} fov  - expected in degrees (optional) | default 45
     * @param {number} zNear  - zNear must be greater than 0 | default 0.1
     * @param {number} zFar  - zFar must be greater than 0 and zNear value | default 100.0
     * @param {number} aspectRatio - canvas.width / canvas.height | default 1 
     */
    enableProjection( fov=45 , aspectRadio=1 , near = 0.1 , far= 100.0){
        const projectionMatrix  = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix , fov * Math.PI / 180 , aspectRadio, near , far);
        const projectionLoc = this.gl.getUniformLocation(this.program.program , 'projection');


        if(!projectionLoc){
            throw new Error("please add 'uniform mat4 projection' to vertex shader");
        }
        this.gl.uniformMatrix4fv(projectionLoc , false,projectionMatrix);
    }

    /**
     * 
     * @param {number[]} [eyePosition=[0,0,3]] 
     * @param {number[]} [target=[0,0,0]] 
     * @param {number[]} [up=[0,1,0]] 
     */
    lookAt(eyePosition=[0,0,3] , target = [0,0,0] , up=[0,1,0]){
        cameraPositions.x  = eyePosition[0];
        cameraPositions.y  = eyePosition[1];
        cameraPositions.z  = eyePosition[2];
        const viewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(viewMatrix , [cameraPositions.x , cameraPositions.y , cameraPositions.z] , target , up)
        const viewLoc = this.gl.getUniformLocation(this.program.program , 'view');


        if(!viewLoc){
            throw new Error("please add 'uniform mat4 view' to vertex shader");
        }

        this.gl.uniformMatrix4fv(viewLoc , false , viewMatrix);


    }

    /**
     * 
     * @deprecated
     */
    enableCameraNavigation(enable=true){
        const keyEventListener = e=>{
            const key = e.key;

            if(key == "+"){
                cameraPositions.z =+.1;
            }else if(key == "-"){
                cameraPositions.y -= .1;
            }else if(key == "ArrowUp"){
                cameraPositions.y =+.1;
            }else if(key == "ArrowDown"){
                cameraPositions.z -= .1;
            }else if(key == "ArrowLeft"){
                cameraPositions.x -= .1;
            }else if(key == "ArrowRight"){
                cameraPositions.x += .1; 
            }

            this.lookAt([cameraPositions.x , cameraPositions.y , cameraPositions.z])

        }
        

        if(enable) window.addEventListener('keydown' , keyEventListener);
        if(!enable) window.removeEventListener('keydown' , keyEventListener);
    }
    

}
