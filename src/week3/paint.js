var gl;

var index = 0;
var painting = false;

var line_buffers = [];
var line_lengths = [];
var line_colors = [];
var line_widths = [];
var curBuffer;
var curColor = {r: 0, g: 0, b: 0};
curLineWidth = 1;

var maxNumVertices = 1000;

var vPosition;
var uColor;

function initGL() {
    var canvas = document.getElementById("gl-canvas")

    console.log("Initializing WebGL");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available!");
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var colorChooser = document.getElementById("colorChooser");
    colorChooser.oninput = function() {
        curColor = hexToRgb(colorChooser.value);
    }
    curColor = hexToRgb(colorChooser.value);

    var lineWidthSlider = document.getElementById("lineWidthSlider");
    var origLineWidthOnInput = lineWidthSlider.oninput;
    lineWidthSlider.oninput = function() {
        origLineWidthOnInput();
        curLineWidth = lineWidthSlider.value;
    }
    curLineWidth = lineWidthSlider.value;


    uColor = gl.getUniformLocation(program, "uColor");

    vPosition = gl.getAttribLocation( program, "vPosition");

    canvas.addEventListener("mousedown", function(event) {
        console.log("Starting new line");
        index = 0;
        curBuffer = createBuffer();
        painting = true;
    });

    canvas.addEventListener("mouseup", function(event) {
        painting = false;
        line_buffers.push(curBuffer);
        line_lengths.push(index);
        line_colors.push(curColor);
        line_widths.push(curLineWidth);
        curBuffer = null;
    });

    var canvasPos = canvas.getBoundingClientRect();

    canvas.addEventListener("mousemove", function(event){
        if (painting) {
            gl.bindBuffer( gl.ARRAY_BUFFER, curBuffer);

            var mx = event.clientX - canvasPos.left;
            var my = event.clientY - canvasPos.top;

            t1 = vec2(2 * mx/canvas.width-1,
                      2 * (canvas.height-my)/canvas.height-1);

            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
            index += 1;
        }
    } );

    render();
}

function createBuffer() {
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    return vBuffer;
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


function render() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (i = 0; i < line_buffers.length; i++) {
        gl.uniform4f(uColor, line_colors[i][0], line_colors[i][1], line_colors[i][2], 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, line_buffers[i]);
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.lineWidth(line_widths[i]);
        gl.drawArrays(gl.LINE_STRIP, 0, line_lengths[i]);
    }


    if (curBuffer != null) {
        gl.uniform4f(uColor, curColor[0], curColor[1], curColor[2], 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, curBuffer);
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.lineWidth(curLineWidth);
        gl.drawArrays(gl.LINE_STRIP, 0, index);
    }

    window.requestAnimFrame(render);

}
