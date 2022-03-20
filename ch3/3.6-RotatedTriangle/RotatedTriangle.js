// 顶点着色器程序
let VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_CosB, u_SinB;
    void main() {
        gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
        gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
        gl_Position.z = a_Position.z;
        gl_Position.w = 1.0;
    }`;

// 片元着色器程序
let FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    
}`;

let Tx = 0.5, Ty = 0.5, Tz = 0.0;

const initVertexBuffers = (gl) => {
    let vertices = new Float32Array([
        0.0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);
    let n = 4;

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

    let Angle = 90.0;
    let radian = Math.PI * Angle / 180.0;
    let cosB = Math.cos(radian);
    let sinB = Math.sin(radian);

    let u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    let u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    // set Clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
    
}