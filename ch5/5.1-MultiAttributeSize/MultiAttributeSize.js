// 顶点着色器程序
let VSHADER_SOURCE = `
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


initVertexBuffers = (gl) => {
    let vertices =  new Float32Array([
        0.0, 0.5,  -0.5, -0.5,  0.5, -0.5
    ]);
    let n = 3;
    let sizes = new Float32Array([
        10.0, 20.0, 30.0
    ]);

    let vertexBuffer = gl.createBuffer();
    let sizeBuffer = gl.createBuffer();
    if (!vertexBuffer || !sizeBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Bind the point size buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if(a_PointSize < 0) {
      console.log('Failed to get the storage location of a_PointSize');
      return -1;
    }

    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    // unbind
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

function main() {
     /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('webgl');

    let gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initial shaders');
        return;
    }

    let n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
      }

    // set Clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, n);
}