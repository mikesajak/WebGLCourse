var gl;
var points;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas")

    console.log("Initializing WebGL");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available!");
    }

    console.log("Prepare data");
    // Prepare data

    // Define vertices for the square
    var points = [];
    var numTimesToSubdivide = 5;

    // initial triangle
    var vertices = [
        vec2(-1, -1),
        vec2( 0,  1),
        vec2( 1, -1)
    ];

    console.log("Tesselation...");
    divideTriangle(vertices[0], vertices[1], vertices[2], numTimesToSubdivide, points);

    console.log("Configure WebGL");
    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate shader variables with variables in JS file

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render(points);

}

function divideTriangle(a, b, c, count, points) {
    // check for recursion
    if (count == 0) {
        points.push(a, b, c);
    } else {
        // bisect the sides
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

//        --count;

        // subdivide
        divideTriangle(a, ab, ac, count - 1, points);
        divideTriangle(c, ac, bc, count - 1, points);
        divideTriangle(b, bc, ab, count - 1, points);
//        divideTriangle(ac, bc, ab, count - 1);
    }
}

//function triangle(a, b, c, points) {
//    points.push(a, b, c);
//}

function render(points) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
