function main() {
    let canvas = document.getElementById('webgl');

    let gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    // set Clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear Canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
}