var gl;

var painting = false;
var maxNumVertices = 10000;

var curPoint;
var prevP3, prevP4;

var BufferData = mkStruct("buffer length color width");

var curBufferData = new BufferData(null, 0, {r:0, g:0, b:0}, 1);
var buffers = [];

var curColor = {r: 0, g: 0, b: 0};
curLineWidth = 1;


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
        curBufferData = new BufferData(createBuffer(), 0, curColor, curLineWidth);
        curBufferData.length = 0;

        triangleIndex = 0;
        curTriangleBuffer = createBuffer();
        curPoint = mousePos(event, canvas);
        painting = true;
    });

    canvas.addEventListener("mouseup", function(event) {
        painting = false;
        buffers.push(curBufferData);
        curBufferData = null;
        prevP3 = null;
        prevP4 = null;
    });

    var canvasPos = canvas.getBoundingClientRect();

    canvas.addEventListener("mousemove", function(event){
        if (painting) {
            var newPoint = mousePos(event, canvas);
            if (!equal(curPoint, newPoint)) {
                gl.bindBuffer(gl.ARRAY_BUFFER, curBufferData.buffer);

                var normal = getNormal2D(curPoint, newPoint);

                normal[0] /= canvas.width;
                normal[1] /= canvas.height;

                var N = scale(curLineWidth, normal);

                var P1 = subtract(curPoint, N);
                var P2 = add     (curPoint, N);
                var P3 = subtract(newPoint, N);
                var P4 = add     (newPoint, N);

                if (prevP3 != null && prevP4 != null) {
                    addTriangleToBuffer2(prevP3, prevP4, P1, curBufferData);
                    addTriangleToBuffer2(prevP3, prevP4, P2, curBufferData);
                }

                addTriangleToBuffer2(P1, P2, P3, curBufferData);
                addTriangleToBuffer2(P2, P3, P4, curBufferData);

                curPoint = newPoint;
                prevP3 = P3;
                prevP4 = P4;
            }
        }
    } );

    render();
}

function addPointToBuffer(P1, bufferPos) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * bufferPos, flatten(P1));
}

function addLineToBuffer(P1, P2, bufferPos) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * bufferPos, flatten(P1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (bufferPos + 1), flatten(P2));
}

function addTriangleToBuffer(P1, P2, P3, bufferPos) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * bufferPos, flatten(P1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (bufferPos + 1), flatten(P2));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (bufferPos + 2), flatten(P3));
}

function addTriangleToBuffer2(P1, P2, P3, bufferData) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * bufferData.length, flatten(P1));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (bufferData.length + 1), flatten(P2));
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (bufferData.length + 2), flatten(P3));
    bufferData.length += 3;
}


function mousePos(event, canvas) {
  var canvasPos = canvas.getBoundingClientRect();
  var mx = event.clientX - canvasPos.left;
  var my = event.clientY - canvasPos.top;

  return vec2(2 * mx / canvas.width - 1,
              2 * (canvas.height - my) / canvas.height - 1);
}

function getNormal2D(pointA, pointB) {
    var AB = subtract(pointB, pointA);
    return normalize(vec2(-AB[1], AB[0]));
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

function renderLineStrip(bufferData) {
    if (bufferData.buffer != null) {
        gl.uniform4f(uColor, bufferData.color[0], bufferData.color[1], bufferData.color[2], 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferData.buffer);
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.drawArrays(gl.TRIANGLES, 0, bufferData.length);
    }
}

function render() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (i = 0; i < buffers.length; i++) {
        renderLineStrip(buffers[i]);
    }

    if (curBufferData != null) {
        renderLineStrip(curBufferData);
    }

    window.requestAnimFrame(render);

}

function mkStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    function constructor() {
        for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
        }
    }
    return constructor;
}
