import Program from "./Program.js";
import * as glMatrix from "./../../node_modules/gl-matrix/esm/index.js";
import Vertical from "./Vertical.js";

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


    constructor(canvas){
        this.canvas = canvas;
        this.initGl();
    }

    init(){
        // this.createProgram();
        this.linkShaders();
    }

    initGl(){
        if(this.gl) return this.gl;
        this.gl = this.canvas.getContext('webgl');
        this.glClear();
        this.createProgram();
        // this.initProgram();
        return this.gl;
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
            throw new Error(`${shaderType}: not compiled` , this.gl.getShaderInfoLog(shader))
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

    createProjectionMatrix(fov , zNear=0.1 , zFar=100 , aspectRatio=1){
        const projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(projectionMatrix , fov , aspectRatio , zNear , zFar);
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


    vertical(x , y ,z){
        return new Vertical(x , y ,z);
    }

    verticalsArray(verticals){
        const array = new Float32Array(verticals.length * 3);
        verticals.forEach((v , i)=> {
            array[i* 3 + 0] = v.x;
            array[i* 3 + 1] = v.y;
            array[i* 3 + 2] = v.z;
        })

        return array;
    }

    render(){
        this.glClear();
        this.enableDepth();
    }

}
