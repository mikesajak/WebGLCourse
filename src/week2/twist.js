var gl;
var points;

var vPositionAttrib;

var theta = 0;
var thetaUniform;

var tesselationDepth = 5;
var sierpinskiMode = false;
var wireframeMode = false;

var color = { r: 1, g: 1, b: 1 };
var colorUniform;

function initGL() {
    var canvas = document.getElementById("gl-canvas")

    var thetaSlider = document.getElementById("thetaSlider");
    var origThetaOnInput = thetaSlider.oninput;
    thetaSlider.oninput = function() {
        origThetaOnInput();
        theta = thetaSlider.value * Math.PI / 180;
        render();
    }
    theta = thetaSlider.value * Math.PI / 180;

    var tessDepthSlider = document.getElementById("tessDepthSlider");
    var origTessDepthOnInput = tessDepthSlider.oninput;
    tessDepthSlider.oninput = function() {
        origTessDepthOnInput();
        tesselationDepth = tessDepthSlider.value;
        prepareData(tesselationDepth, sierpinskiMode);
        render();
    }
    tesselationDepth = tessDepthSlider.value;

    var colorChooser = document.getElementById("colorChooser");
    colorChooser.oninput = function() {
        color = hexToRgb(colorChooser.value);
        console.log("color=" + color[0] + ", " + color[1] + ", " + color[2]);
        render();
    }
    color = hexToRgb(colorChooser.value);
    console.log("color=" + color[0] + ", " + color[1] + ", " + color[2]);

    var sierpinskiCheckbox = document.getElementById("sierpModeCheckbox");
    sierpinskiCheckbox.onclick = function() {
        sierpinskiMode = sierpinskiCheckbox.checked;
        prepareData();
        render();
    }
    sierpinskiMode = sierpinskiCheckbox.checked;

    var wireframeCheckbox = document.getElementById("wireframeCheckbox");
    wireframeCheckbox.onclick= function() {
        wireframeMode = wireframeCheckbox.checked;
        prepareData();
        render();
    }
    wireframeMode = wireframeCheckbox.checked;

    console.log("Initializing WebGL");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available!");
    }

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Associate shader variables with variables in JS file
    vPositionAttrib = gl.getAttribLocation(program, "vPosition");
    thetaUniform = gl.getUniformLocation(program, "theta");
    colorUniform = gl.getUniformLocation(program, "color");

    prepareData();

    console.log("Preparations done.");
    render();
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
        1
    ] : null;
}

function prepareData() {
    console.log("Prepare data");
    // Prepare data

    // Define vertices for the square
    points = [];

    var a = 1.5
    var h =  a/2 * Math.tan(Math.PI/3);
    var h1 = a/2 * Math.tan(Math.PI/6);

    // initial triangle
    var vertices = [
      vec2(-a/2,    -h1),
      vec2(   0, h - h1),
      vec2( a/2,    -h1)
    ];

    console.log("Tesselation depth=" + tesselationDepth);
    divideTriangle(vertices[0], vertices[1], vertices[2], tesselationDepth, points);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vPositionAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPositionAttrib);
}

function pushTriangle(a, b, c, points) {
    points.push(a, b, c);
}

function pushWireTriangle(a, b, c, points) {
    points.push(a, b, b, c, c, a);
}

function divideTriangle(a, b, c, count, points) {
    // check for recursion
    if (count == 0) {
//        points.push(a, b, c);
        if (wireframeMode) {
            pushWireTriangle(a, b, c, points);
        } else {
            pushTriangle(a, b, c, points);
        }
    } else {
        // bisect the sides
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        // subdivide
        divideTriangle(a, ab, ac, count - 1, points);
        divideTriangle(c, ac, bc, count - 1, points);
        divideTriangle(b, bc, ab, count - 1, points);
        if (!sierpinskiMode) {
            divideTriangle(ab, ac, bc, count - 1, points);
        }
    }
}

function render() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(thetaUniform, theta);
    gl.uniform4f(colorUniform, color[0], color[1], color[2], 1);

    if (wireframeMode) {
//        console.log("Rendering wireframe...");
//        for (i = 0; i < points.length/3; i++) {
//            var offset = i * 3;
//            gl.drawArrays(gl.LINE_LOOP, offset, 3);
//        }
        gl.drawArrays(gl.LINES, 0, points.length);
    } else {
        gl.drawArrays(gl.TRIANGLES, 0, points.length);
    }
}
