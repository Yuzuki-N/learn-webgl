// 顶点着色器程序
let VSHADER_SOURCE = 
    `#pragma vscode_glsllint_stage : vert

    void main() {
     
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
      
        gl_PointSize = 10.0;
    
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

    // set Clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1);
}