// 顶点着色器程序
let VSHADER_SOURCE = `
    attribute vec4 a_Position;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
    
    }`;

// 片元着色器程序
let FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    
}`;

const initVertexBuffers = (gl) => {
    let vertices = new Float32Array([
        0.0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);
    let n = 3;

    // 1. create a buffer object
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 2. Bind buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 3. write data into the buffer  object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
      }

    // 4. Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 5. Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}


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

    // 执行buffer相关的操作
    let n = initVertexBuffers(gl)
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // set Clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, n)
    
}