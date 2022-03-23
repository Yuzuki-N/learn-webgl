// 顶点着色器程序
let VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ModelMatrix * a_Position;
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

const draw = (gl, n, currentAngle, modelMatrix, u_ModelMatrix) => {
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.translate( 0.35, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

let g_last = Date.now();
let ANGLE_STEP = 45.0;
animate = (angle) => {
    let now = Date.now();
    let elapsed = now - g_last;
    g_last = now;

    let newAngle = angle + (elapsed * ANGLE_STEP) / 1000.0;
    return newAngle % 360;
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

    gl.clearColor(0, 0, 0, 1);


    // modelMatrix.setRotate(Angle, 0, 0, 1)
    
    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    let currentAngle = 0.0;
    // create matrix
    let modelMatrix = new Matrix4();
    let tick = () => {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick, canvas);
    };

    tick();
    
}