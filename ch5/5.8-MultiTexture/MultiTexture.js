let VSHADER_SOURCE = `
	attribute vec4 a_Position;
	attribute vec2 a_TexCoord;
	varying vec2 v_TexCoord;
	void main() {
			gl_Position = a_Position;
			v_TexCoord = a_TexCoord;
	}
`;

let FSHADER_SOURCE = `
  precision mediump float;
	uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
	varying vec2 v_TexCoord;
	void main() {
      vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
      vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
			gl_FragColor = color0 * color1;
	}
`;

let initVertexBuffers = (gl) => {
	let verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
     0.5, -0.5,   1.0, 0.0
  ]);
  let n = 4; // The number of vertices

	let vertexTexCoordBuffer = gl.createBuffer();
	if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

	// Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

	let FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
	gl.enableVertexAttribArray(a_Position);

	// Get the storage location of a_TexCoord
  let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

	return n;
}

let g_texUnit0 = false, g_texUnit1 = false; 
const loadTexture = (gl, n, texture, u_Sampler, image, texUnit) => {

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } else {
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, texUnit);
  
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  if (g_texUnit0 && g_texUnit1) {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}


const initTextures = (gl, n) => {
	let texture0 = gl.createTexture();
  let texture1 = gl.createTexture();
	if (!texture0 || !texture1) {
    console.log('Failed to create the texture object');
    return false;
  }
	// Get the storage location of u_Sampler
	let u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
	if (!u_Sampler0 || !u_Sampler1) {
		console.log('Failed to get the storage location of u_Sampler');
		return false;
	}
  let image0 = new Image();
  let image1 = new Image();
  if (!image0 || !image1) {
    console.log('Failed to create the image object');
    return false;
  }
  image0.onload = () => {loadTexture(gl, n, texture0, u_Sampler0, image0, 0)};
  image0.src = "../../resources/sky.jpg";

  image1.onload = () => {loadTexture(gl, n, texture1, u_Sampler1, image1, 1)};
  image1.src = "../../resources/circle.gif";

  return true;
}



function main() {
  let canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  let gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

	let n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

	// Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Set texture
  if (!initTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }
}