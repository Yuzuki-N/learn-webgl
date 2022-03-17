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

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    canvas.onmousedown = (ev) => {
        click(ev, gl, canvas, a_Position);
    };


    // set Clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT);


    let g_points = [];
    click = (ev, gl, canvas, a_Position) => {
        let x = ev.clientX;
        let y = ev.clientY;
        let rect = ev.target.getBoundingClientRect();
        
        x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        // Store the coordinates to g_points array
        // g_points.push(x); g_points.push(y);
        g_points.push([x, y])
        gl.clear(gl.COLOR_BUFFER_BIT);

        let len = g_points.length;
        for (let i =  0; i < len; i++) {
            let xy = g_points[i]
            gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

            gl.drawArrays(gl.POINTS, 0, 1)
        }

    }

    // // 绘制一个点
    // gl.drawArrays(gl.POINTS, 0, 1);
}