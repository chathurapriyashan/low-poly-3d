export default class Program{
    /**
     * @type {WebGL2RenderingContext}
     */
    gl =undefined;
    /**
     * @type {WebGLShader[]}
     */
    shaders = [];

    /**
     * @param {WebGL2RenderingContext} gl
     */
    constructor(gl){
        this.gl = gl;
        this.program = this.gl.createProgram();
    }

    /**
     * 
     * @param {WebGLShader} shader 
     */
    attachShader(shader){
        this.shaders.push(shader);
        
    }

    /**
     * @description - link all attached shaders together
     */
    linkShaders(){
        this.shaders.forEach(shader=>this.gl.attachShader(this.program , shader));
        this.gl.linkProgram(this.program);

        if(!this.gl.getProgramParameter(this.program , this.gl.LINK_STATUS)){
            throw new Error("program link unsuccessful :" , this.gl.getProgramInfoLog(this.program));
        }
    }

}