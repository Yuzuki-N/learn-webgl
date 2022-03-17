// 顶点着色器程序
let VSHADER_SOURCE = 
    `#pragma vscode_glsllint_stage : vert
    attribute vec4 a_Position;
    attribute float a_PointSize;

    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
    
    }`;

// 片元着色器程序
let FSHADER_SOURCE = `
    #pragma vscode_glsllint_stage : frag
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    
}`;


function main() {
     /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('webgl');

    let gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initial shaders');
        return;
    }

    // 获取attribute变量的存储位置
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')

    // 将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    gl.vertexAttrib1f(a_PointSize, 50.0);

    // set Clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1);
}