"use strict";

var gl;

Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
}

Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
}

var CubeModel = {
    name : "Cube",
    vertices : [
        vec3(-0.5, -0.5, -0.5), // 0
        vec3( 0.5, -0.5, -0.5), // 1
        vec3( 0.5,  0.5, -0.5), // 2
        vec3(-0.5,  0.5, -0.5), // 3

        vec3(-0.5, -0.5,  0.5), // 4
        vec3( 0.5, -0.5,  0.5), // 5
        vec3( 0.5,  0.5,  0.5), // 6
        vec3(-0.5,  0.5,  0.5), // 7
    ],
    faces : [
        vec3(0, 1, 2),  vec3(0, 2, 3), // front
        vec3(2, 3, 6),  vec3(3, 6, 7), // top
        vec3(0, 1, 4),  vec3(1, 4, 5), // bottom
        vec3(0, 3, 4),  vec3(3, 4, 7), // right
        vec3(1, 2, 6),  vec3(1, 6, 5), // left
        vec3(4, 5, 6),  vec3(4, 6, 7), // back
    ]
}

var TetraHedronModel = {
    name : "TetraHedron",
    vertices : [
        vec3( 1,  1,  1),
        vec3(-1, -1,  1),
        vec3(-1,  1, -1),
        vec3( 1, -1, -1)

    ],
    faces : [
        vec3(0, 1, 2),
        vec3(0, 2, 3),
        vec3(0, 1, 3),
        vec3(1, 2, 3)
    ]
}

var TetraHedronModel2 = {
    name : "TetraHedron2",
    vertices : [
        vec3(-1,  0, -1/Math.sqrt(2)),
        vec3( 1,  0, -1/Math.sqrt(2)),
        vec3( 0, -1,  1/Math.sqrt(2)),
        vec3( 0,  1,  1/Math.sqrt(2))

    ],
    faces : [
        vec3(0, 1, 2),
        vec3(0, 2, 3),
        vec3(0, 1, 3),
        vec3(1, 2, 3)
    ]
}

var TetraHedronModel3 = {
    name : "TetraHedron3",
    vertices : [
//        vec3(-1, -1/Math.sqrt(6), -1/Math.sqrt(3)),
//        vec3( 1, -1/Math.sqrt(6), -1/Math.sqrt(3)),
//        vec3( 0, -1/Math.sqrt(6),  2/Math.sqrt(3)),
//        vec3( 0,  3/Math.sqrt(6),  0)
        vec3( 0, 2/Math.sqrt(3), 0),
        vec3(-1, 0, -1/Math.sqrt(3)),
        vec3( 1, 0, -1/Math.sqrt(3)),
        vec3( 0, 0,  2/Math.sqrt(3))
    ],
    faces : [
        vec3(0, 1, 2),
        vec3(0, 2, 3),
        vec3(0, 1, 3),
        vec3(1, 2, 3)
    ]
}

var OctahedronModel = {
    name : "Octahedron",
    vertices : [
        vec3( 0,  1,  0),
        vec3(-1,  0,  0),
        vec3( 0,  0, -1),
        vec3( 1,  0,  0),
        vec3( 0,  0,  1),
        vec3( 0, -1,  0)
    ],
    faces : [
        vec3(0, 1, 2),
        vec3(0, 2, 3),
        vec3(0, 3, 4),
        vec3(0, 4, 1),

        vec3(5, 1, 2),
        vec3(5, 2, 3),
        vec3(5, 3, 4),
        vec3(5, 4, 1)
    ]
}

var basePlaneGrid = {
    vertices : [],

    vertexBuffer : null
}
var showBasePlaneGrid = true;

var showWireframe = true;

var renderFunc = null;

var modelTypes = [];
var modelInstances = [];

var selectedModelName = null;
var selectedCamera = null;

var blink = false;
var blinkTimer = null;

var useLighting = false;
var selModelChooser = null;
var modelTypeChooser = null;
var modelPropertyWidgets = [];

var sheetColor = vec4(0.8, 0.8, 0.8, 1)
var planeGridColor = vec4(0.6, 0.6, 0.6, 1)
var defaultFaceColor = vec4(1, 1, 1, 1)
var selectedFaceColor = vec4(1, 0, 0, 0.1)
var wireframeColor = vec4(0.4, 0.4, 0.4, 1)


function initGL() {
    var canvas = document.getElementById("gl-canvas")

    console.log("Initializing WebGL");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available!");
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(sheetColor[0], sheetColor[1], sheetColor[2], sheetColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.polygonOffset(1.0, 1.0);

    // Load shaders
    var shaderVars = initShaderVars("vertex-shader-simple", "fragment-shader-simple");

//    var vertexLightingShaderVars = initLightingShaderVars("vertex-shader-vertex-lighting", "fragment-shader-simple");

    var camera = {
        name: "camera1",
        eye: vec3(0, 7, 15), // move camera back in Z and a little up to create nice angle looking at origin
        at: vec3(0, 0, 0),
        up: vec3(0, 1, 0),

        viewMatrix: mat4(),
        projectionMatrix : mat4()
    };
    selectedCamera = camera;

    installGuiHandlers(shaderVars);
    installSupportedModels();

    var basePlaneGrid = generateBasePlane(shaderVars, 20, 0.5, 0.5, 0);

    // prepare perspective projection
    camera.projectionMatrix = perspective(45, canvas.width / canvas.height, 0.1, 100);
    camera.viewMatrix = lookAt(camera.eye, camera.at, camera.up);


    renderFunc = function() {
        render(shaderVars, camera, basePlaneGrid);
//        window.requestAnimFrame(renderFunc);
    };

    window.requestAnimFrame(renderFunc);
}

function render(shaderVars, camera, basePlaneGrid) {
    gl.clearColor(sheetColor[0], sheetColor[1], sheetColor[2], sheetColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    camera.viewMatrix = lookAt(camera.eye, camera.at, camera.up);
    gl.uniformMatrix4fv(shaderVars.projectionMatrix, false, flatten(camera.projectionMatrix));

    if (showBasePlaneGrid) {
        prepareFlatShaderForModel(shaderVars, basePlaneGrid, camera.viewMatrix);
        drawModelItems(shaderVars, basePlaneGrid, gl.LINES);
    }

    for (var modelName in modelInstances) {
        var model = modelInstances[modelName];
//        console.log("Rendering model: " + modelName + "\n" + JSON.stringify(model, null, 2))

        var modelViewMatrix = mult(camera.viewMatrix, mkModelMatrix(model));

        gl.enable(gl.POLYGON_OFFSET_FILL);
        if (model.name == selectedModelName && blink) {
            prepareFlatShaderForModel(shaderVars, model, modelViewMatrix, selectedFaceColor);
        } else {
            prepareFlatShaderForModel(shaderVars, model, modelViewMatrix);
        }
        drawModelItems(shaderVars, model, gl.TRIANGLES);

        gl.disable(gl.POLYGON_OFFSET_FILL);

        if (showWireframe) {
            prepareFlatShaderForModel(shaderVars, model, modelViewMatrix, wireframeColor);
            drawModelWireframe(shaderVars, model);
        }
    }
}

function prepareFlatShaderForModel(shaderVars, model, modelViewMatrix, forceColor) {
    gl.useProgram(shaderVars.programId);

    gl.uniformMatrix4fv(shaderVars.modelViewMatrix, false, flatten(modelViewMatrix));

    var color = forceColor != null ? forceColor : model.color;
    gl.uniform4f(shaderVars.uColor, color[0], color[1], color[2], color[3]);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexPosBuffer.id);
    gl.vertexAttribPointer(shaderVars.vPosition, model.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if (model.vertexColorBuffer != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexColorBuffer.id);
        gl.vertexAttribPointer(shaderVars.vColor, model.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
}

function drawModelItems(shaderVars, model, renderMode) {
    if (isValid(model.faceIndexBuffer)) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.faceIndexBuffer.id);
        gl.drawElements(renderMode, model.faceIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.drawArrays(renderMode, 0, model.vertexPosBuffer.numItems / model.vertexPosBuffer.itemSize);
    }
}

function drawModelWireframe(shaderVars, model) {
    if (isValid(model.faceIndexBuffer)) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.faceIndexBuffer.id);
        for (var i = 0; i < model.faceIndexBuffer.numItems / 3; i++) {
            gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i * 3 * model.faceIndexBuffer.itemSize);
        }
    } else {
        for (var i = 0; i < model.vertexPosBuffer.numItems / 3; i++) {
            gl.drawArrays(gl.LINE_LOOP, i*3, 3);
        }
    }
}


function initShaderVars(vertexShader, fragmentShader) {
    console.log("initShaderVars: vertexShader=" + vertexShader + ", framentShader=" + fragmentShader);
    var program = initShaders(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    var shaderVars =  {
        programId: program,
        vPosition : gl.getAttribLocation(program, "aPosition"),
        vColor : gl.getAttribLocation(program, "aColor"),

        projectionMatrix : gl.getUniformLocation(program, "uProjectionMatrix"),
        modelViewMatrix : gl.getUniformLocation(program, "uModelViewMatrix"),
//        normalMatrix : gl.getUniformLocation(program, "uNormalMatrix")

        uForceColor : gl.getUniformLocation(program, "uForceColor"),
        uColor : gl.getUniformLocation(program, "uColor"),

        uMaterial : gl.getUniformLocation(program, "uMaterial"),
        uLightingModel : gl.getUniformLocation(program, "uLightingModel"),
        uLights : gl.getUniformLocation(program, "uLights")
    };

    gl.enableVertexAttribArray(shaderVars.vPosition);
//    gl.enableVertexAttribArray(shaderVars.vColor);

    console.log("shaderVars: " + JSON.stringify(shaderVars));
    return shaderVars;
}

function modelSelector() {
    return modelInstances[selectedModelName];
}

function cameraSelector() {
    return selectedCamera;
}

function linkGUIModelProperty(widgetId, selectorFunc, property, index, conversion) {
    var widget = document.getElementById(widgetId);
    var origOnInput = widget.oninput;
    var changing = false;
    widget.oninput = function() {
        if (!changing) {
            changing = true;

            origOnInput();
//            var model = modelInstances[selectedModelName];
            var model = selectorFunc();
            if (model != null) {
                var value = conversion != null ? conversion(widget.value) : widget.value;
                model[property][index] = value;
                window.requestAnimFrame(renderFunc);;
            }
            changing = false;
        }
    };
    return widget;
}

function installGuiHandlers(shaderVars) {
    var showGridCheckbox = document.getElementById("showGridCheckbox");
    showGridCheckbox.onclick = function() {
        showBasePlaneGrid = showGridCheckbox.checked;
        window.requestAnimFrame(renderFunc);
    }
    showBasePlaneGrid = showGridCheckbox.checked;

    var showWireframeCheckbox = document.getElementById("showWireframeCheckbox");
    showWireframeCheckbox.onclick = function() {
        showWireframe = showWireframeCheckbox.checked;
        window.requestAnimFrame(renderFunc);
    }
    showWireframe = showWireframeCheckbox.checked;

    // camera position
    var camXPosSlider = linkGUIModelProperty("camXPosSlider", cameraSelector, "eye", 0);
    var camYPosSlider = linkGUIModelProperty("camYPosSlider", cameraSelector, "eye", 1);
    var camZPosSlider = linkGUIModelProperty("camZPosSlider", cameraSelector, "eye", 2);
    selectedCamera.eye = vec3(camXPosSlider.value, camYPosSlider.value, camZPosSlider.value);

    var lightingModelChooser = document.getElementById("lightingModelChooser");
    lightingModelChooser.onchange = function() {
        useLighting = lightingModelChooser.value == "lighting";
        window.requestAnimFrame(renderFunc);
    };
    useLighting = lightingModelChooser.value == "lighting";

    // position

    var xPosSlider = linkGUIModelProperty("xPosSlider", modelSelector, "position", 0);
    var xPosText= document.getElementById("xPosText");
    modelPropertyWidgets.push(xPosSlider, xPosText);

    var yPosSlider = linkGUIModelProperty("yPosSlider", modelSelector, "position", 1);
    var yPosText = document.getElementById("yPosText");
    modelPropertyWidgets.push(yPosSlider, yPosText);

    var zPosSlider = linkGUIModelProperty("zPosSlider", modelSelector, "position", 2);
    var zPosText = document.getElementById("zPosText");
    modelPropertyWidgets.push(zPosSlider, zPosText);

    var posResetButton = document.getElementById("posResetButton");
    modelPropertyWidgets.push(posResetButton);

    // rotation

    var xRotSlider = linkGUIModelProperty("xRotSlider", modelSelector, "rotation", 0, Math.radians);
    var xRotText= document.getElementById("xRotText");
    modelPropertyWidgets.push(xRotSlider, xRotText);

    var yRotSlider = linkGUIModelProperty("yRotSlider", modelSelector, "rotation", 1, Math.radians);
    var yRotText = document.getElementById("yRotText");
    modelPropertyWidgets.push(yRotSlider, yRotText);

    var zRotSlider = linkGUIModelProperty("zRotSlider", modelSelector, "rotation", 2, Math.radians);
    var zRotText = document.getElementById("zRotText");
    modelPropertyWidgets.push(zRotSlider, zRotText);

    var rotResetButton = document.getElementById("rotResetButton");
    modelPropertyWidgets.push(rotResetButton);

    // scale
    var xScaleSlider = linkGUIModelProperty("xScaleSlider", modelSelector, "scale", 0);
    var xScaleText= document.getElementById("xScaleText");
    modelPropertyWidgets.push(xScaleSlider, xScaleText);

    var yScaleSlider = linkGUIModelProperty("yScaleSlider", modelSelector, "scale", 1);
    var yScaleText = document.getElementById("yScaleText");
    modelPropertyWidgets.push(yScaleSlider, yScaleText);

    var zScaleSlider = linkGUIModelProperty("zScaleSlider", modelSelector, "scale", 2);
    var zScaleText = document.getElementById("zScaleText");
    modelPropertyWidgets.push(zScaleSlider, zScaleText);

    var scaleResetButton = document.getElementById("scaleResetButton");
    modelPropertyWidgets.push(scaleResetButton);

    selModelChooser = document.getElementById("selModelChooser");
//    var origSelModelChooserOnChange = selModelChooser.onchange;
    selModelChooser.onchange = function() {
//        origSelModelChooserOnChange();
        selectedModelName = selModelChooser.value;
        var selectedModel = modelInstances[selectedModelName];

        if (blinkTimer != null) {
            clearInterval(blinkTimer);
            blinkTimer = null;
        }

        if (selectedModel != null) {
            xPosText.value = selectedModel.position[0]; xPosText.oninput();
            yPosText.value = selectedModel.position[1]; yPosText.oninput();
            zPosText.value = selectedModel.position[2]; zPosText.oninput();

            xRotText.value = Math.degrees(selectedModel.rotation[0]); xRotText.oninput();
            yRotText.value = Math.degrees(selectedModel.rotation[1]); yRotText.oninput();
            zRotText.value = Math.degrees(selectedModel.rotation[2]); zRotText.oninput();

            xScaleText.value= selectedModel.scale[0]; xScaleText.oninput();
            yScaleText.value= selectedModel.scale[1]; yScaleText.oninput();
            zScaleText.value= selectedModel.scale[2]; zScaleText.oninput();

            blinkTimer = setInterval(function () {
                    blink = !blink;
                    window.requestAnimFrame(renderFunc);
                }, 500);

        }

        updateModelPropertyWidgets();

        window.requestAnimFrame(renderFunc);
    };

    updateModelPropertyWidgets();

    var createModelButon = document.getElementById("createModelButton");
    modelTypeChooser = document.getElementById("modelTypeChooser");

    createModelButon.onclick = function() {
        var modelType = modelTypeChooser.value;
        var model = modelTypes[modelType];

        var modelInstance = createModelInstance(shaderVars, model);
        modelInstance.name = modelInstance.name + countProps(modelInstances);
        addModelInstance(modelInstance);

        window.requestAnimFrame(renderFunc);
    }


}

function updateModelPropertyWidgets() {
    for (var i = 0; i < modelPropertyWidgets.length; i++) {
        var selectedModel = modelInstances[selectedModelName];
        modelPropertyWidgets[i].disabled = (selectedModel == null);
    }
}

function installSupportedModels() {
    addModelType(CubeModel);
//    addModelType(TetraHedronModel);
//    addModelType(TetraHedronModel2);
    addModelType(TetraHedronModel3);
    addModelType(OctahedronModel);
    addModelType(generateConeModel(10, 0.5, 2));
    addModelType(generateCylinderModel(10, 0.5, 2));
    addModelType(generateSphereModel3(16, 1));
    addModelType(generateIcoSphereModel(3, 1));
}

function addModelType(model) {
    modelTypes[model.name] = model;

    var option = document.createElement("option");
    option.text = model.name;
    modelTypeChooser.add(option);
}

function addModelInstance(modelInstance) {
    modelInstances[modelInstance.name] = modelInstance;

    var option = document.createElement("option");
    option.text = modelInstance.name;
    selModelChooser.add(option);
}

function initBuffersForModel(shaderVars, model, modelInstance) {
    var vertexBufId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufId)
    var vertices = flatten(model.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(shaderVars.vPosition, 3, gl.FLOAT, false, 0, 0);
//    gl.enableVertexAttribArray(shaderVars.vPosition);

    modelInstance.vertexPosBuffer = { id: vertexBufId, itemSize: 3, numItems: vertices.length };

    if (isValid(model.faces)) {
        var indexBufId = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufId);
        var faces = flatten(model.faces);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);
        modelInstance.faceIndexBuffer = { id: indexBufId, itemSize: 2, numItems: faces.length };
    }
}

function createModelInstance(shaderVars, model) {
    var modelInstance = {
        name: model.name,
        position: vec3(0, 0, 0),
        rotation: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        color: defaultFaceColor,

        modelMatrix: mat4(), // identity

        vertexPosBuffer: null,
//        vertexColBuffer: {},
        faceIndexBuffer: null
    };

    initBuffersForModel(shaderVars, model, modelInstance);

    return modelInstance;
}

function generateConeModel(numPoints, radius, height) {
    console.log("generateConeModel: numPoints=" + numPoints + ", radius=" + radius + ", height=" + height);
    var model = {
        name: "Cone",
        vertices: [],
        faces: []
    };

    generateConeFan(numPoints, radius, 0, height, model.vertices, model.faces);
    generateConeFan(numPoints, radius, 0, 0, model.vertices, model.faces, model.vertices.length - numPoints);

    return model;
}

function generateCylinderModel(numPoints, radius, height) {
    console.log("generateCylinderModel: numPoints=" + numPoints + ", radius=" + radius + ", height=" + height);
    var model = {
        name: "Cylinder",
        vertices: [],
        faces: []
    };

    generateConeFan(numPoints, radius, 0, 0, model.vertices, model.faces);
    generateCylinderStrip(numPoints, radius, 0, radius, height, model.vertices, model.faces, model.vertices - numPoints);
    generateConeFan(numPoints, radius, height, 0, model.vertices, model.faces, -1, model.vertices - numPoints);

//    console.log("model.vertices(" + model.vertices.length + ")")
//    console.log("model.faces(" + model.faces.length + ")=" + JSON.stringify(model.faces));

    return model;
}

function generateIcoSphereModel(numSubdivisions, radius) {

    var resultVertices = [];

    var vertices = OctahedronModel.vertices;

    // tesselate octahedron to get regular net of vertice triangles
    for (var i = 0; i < OctahedronModel.faces.length; i++) {
        var tmpVertices = [];

        var face = OctahedronModel.faces[i];
        divideTriangle(vertices[face[0]],
                       vertices[face[1]],
                       vertices[face[2]],
                       numSubdivisions,
                       tmpVertices);

        pushArray(resultVertices, tmpVertices);
    }

    // correct all vertices to have radius - push them away/towards center to generate actual sphere
    for (var i = 0; i < resultVertices.length; i++) {
        var v = resultVertices[i];
        var len = Math.sqrt(dot(v, v));
        var k = radius * (1 / len);

        var v1 = scale(k, v);
        resultVertices[i] = v1;
    }

    return {
        name : "Icosphere",
        vertices : resultVertices,
        faces : null // do not use face index buffer
    };

}

function generateSphereModel3(numSteps, radius) {
    console.log("generateSphereModel: numSteps=" + numSteps+ ", numSteps=" + numSteps + ", radius=" + radius);
    var model = {
        name: "Sphere",
        vertices: [],
        faces: []
    };

    var phiStep = Math.PI / numSteps;
    var firstRadius = radius * Math.sin(phiStep);
    var firstY =      radius * Math.cos(phiStep);

    generateConeFan(numSteps, firstRadius, firstY, radius-firstY, model.vertices, model.faces);

    for (var i = 1; i < numSteps-1; i++) {
        var phi = i * phiStep;
        var curRadius = radius * Math.sin(phi);
        var nextRadius = radius * Math.sin(phi + phiStep);
        var curY = radius * Math.cos(phi);
        var nextY = radius * Math.cos(phi + phiStep);

        generateCylinderStrip(numSteps, curRadius, curY, nextRadius, nextY,
                              model.vertices, model.faces, model.vertices.length - numSteps);
    }

    generateConeFan(numSteps, firstRadius, -firstY, -radius+firstY, model.vertices, model.faces, -1, model.vertices.length - numSteps);

    return model;
}

function genCircleXZVertices(radius, yPos, numPoints, vertices) {
    console.log("--genCircleXZVertices: radius=" + radius + ", yPos=" + yPos + ", numPoints=" + numPoints + ", vertices.len=" + vertices.length);
    var step = 2 * Math.PI / numPoints;
    for (var i = 0; i < numPoints ; i++) {
        var theta = i * step;

        var x = radius * Math.cos(theta);
        var z = radius * Math.sin(theta);
        vertices.push(vec3(x, yPos, z));
    }
}

function generateCylinderStrip(numSteps, radius1, yPos1, radius2, yPos2, vertices, faces, reuseVertices1Idx, reuseVertices2Idx) {

    function reuseVerticesGenerator(reuseVerticesStartIdx, numSteps, vertices) {
        return reuseVerticesStartIdx;
    }

    function circleVerticesGenerator(radius, yPos, numSteps, vertices) {
        var startIdx = vertices.length;//vertices.length /3
        genCircleXZVertices(radius, yPos, numSteps, vertices);
        return startIdx;
    }

    var line1Generator = (typeof reuseVertices1Idx != 'undefined' && reuseVertices1Idx >= 0)
                                ? partial(reuseVerticesGenerator, reuseVertices1Idx)
                                : partial(circleVerticesGenerator, radius1, yPos1);
    var line2Generator = (typeof reuseVertices2Idx != 'undefined' && reuseVertices2Idx >= 0)
                                ? partial(reuseVerticesGenerator, reuseVertices2Idx)
                                : partial(circleVerticesGenerator, radius2, yPos2);

    generateStrip(numSteps, line1Generator, line2Generator, vertices, faces);
}

function generateStrip(numSteps, line1VertexGenerator, line2VertexGenerator, vertices, faces) {

    var row1StartIdx = line1VertexGenerator(numSteps, vertices);
    var row2StartIdx = line2VertexGenerator(numSteps, vertices);

    console.log("generateStrip: row1StartIdx=" + row1StartIdx + ", row2StartIdx=" + row2StartIdx);

    for (var i = 0; i < numSteps - 1; i++) {
        faces.push(vec3(row1StartIdx + i, row1StartIdx + i + 1, row2StartIdx + i));
        faces.push(vec3(row2StartIdx + i, row2StartIdx + i + 1, row1StartIdx + i + 1));
    }

    faces.push(vec3(row1StartIdx + numSteps - 1, row1StartIdx,                row2StartIdx + numSteps - 1));
    faces.push(vec3(row1StartIdx,                row2StartIdx + numSteps - 1, row2StartIdx));
//    console.log("-- vertices(" + vertices.length + ")");
//    console.log("-- faces(" + faces.length + ")=" + JSON.stringify(faces));
}

function generateConeFan(numSteps, radius, yPos, height, vertices, faces, reuseTipVertexIdx, reuseBaseVerticesIdx) {
    console.log("generateConeFan: numSteps=" + numSteps + ", radius=" + radius + ", yPos=" + yPos + ", height=" + height);
    function reuseVertexStartIdx(startIdx, vertices) {
        return startIdx;
    }

    function tipVertexGenerator(vertices) {
        vertices.push(vec3(0.0, yPos + height, 0.0));
        return vertices.length - 1;
    }

    function circleVerticesGenerator(radius, yPos, numSteps, vertices) {
        var startIdx = vertices.length;
        genCircleXZVertices(radius, yPos, numSteps, vertices);
        return startIdx;
    }

    var tipGenFunc = isValidIdx(reuseTipVertexIdx)
                            ? partial(reuseVertexStartIdx, reuseTipVertexIdx)
                            : tipVertexGenerator;
    var baseGenFunc = isValidIdx(reuseBaseVerticesIdx)
                            ? partial(reuseVertexStartIdx, reuseBaseVerticesIdx)
                            : partial(circleVerticesGenerator, radius, yPos);

    generateFan(numSteps, tipGenFunc, baseGenFunc, vertices, faces);
}

function generateFan(numPoints, tipVertexGenerator, baseVerticesGenerator, vertices, faces) {
    var centerIdx = tipVertexGenerator(vertices);
    var firstIdx = baseVerticesGenerator(numPoints, vertices);

    for (var i = 0; i < numPoints - 1; i++) {
        faces.push(vec3(centerIdx, firstIdx + i, firstIdx + i + 1));
    }

    faces.push(vec3(centerIdx, firstIdx + numPoints - 1, firstIdx));

//    console.log("--vertices(" + vertices.length + ")");
//    console.log("--faces(" + faces.length + ")=" + JSON.stringify(faces));
}


function generateGrid(N, stepX, stepZ, y) {
    var minX = -N/2*stepX
    var maxX =  N/2*stepX

    var minZ = -N/2*stepZ
    var maxZ =  N/2*stepZ

    var gridPoints = []

    var x = minX
    var z = minZ

    for (var i = 0; i < N; i++) {
        gridPoints.push(minX, y, z,  maxX, y, z);
        gridPoints.push(x, y, minZ,  x, y, maxZ);
        x += stepX
        z += stepZ
    }

    gridPoints.push(minX, y, maxZ,  maxX, y, maxZ);
    gridPoints.push(maxX, y, minZ,  maxX, y, maxZ);

    return gridPoints;
}

function generateBasePlane(shaderVars, N, stepX, stepZ, y) {
    var basePlaneGrid = {
        name : "Base plane grid",
        vertices : generateGrid(N, stepX, stepZ, y),

        color : planeGridColor,
        vertexBuffer : null
    }

    var vertexBufId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufId)
    gl.bufferData(gl.ARRAY_BUFFER, flatten(basePlaneGrid.vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(shaderVars.vPosition, 3, gl.FLOAT, false, 0, 0);

    basePlaneGrid.vertexPosBuffer = { id: vertexBufId, itemSize: 3, numItems: basePlaneGrid.vertices.length };
//    basePlaneGrid.vertexPosBuffer = new BufferData(vertexBufId, 3, basePlaneGrid.vertices.length, gl.LINES)

    return basePlaneGrid;
}

function partial(fn /*, args...*/) {
    // A reference to the Array#slice method.
    var slice = Array.prototype.slice;
    // Convert arguments object to an array, removing the first argument.
    var args = slice.call(arguments, 1);

    return function() {
        // Invoke the originally-specified function, passing in all originally-
        // specified arguments, followed by any just-specified arguments.
        return fn.apply(this, args.concat(slice.call(arguments, 0)));
    };
 }

function isDefined(variable) {
    return typeof variable != 'undefined';
}

function isValid(variable) {
    return isDefined(variable) && variable != null;
}

function isValidIdx(idxVar) {
    return isDefined(idxVar) && idxVar != null && idxVar >= 0;
}

function pushArray(arr, arr2) {
    arr.push.apply(arr, arr2);
}

function countProps(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
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

function translateMatrix(M, tvec) {
    return mult(mkTranslationMatrix(tvec), M);
}

function mkTranslationMatrix(tvec) {
    return mat4(1, 0, 0, tvec[0],
                0, 1, 0, tvec[1],
                0, 0, 1, tvec[2],
                0, 0, 0, 1);
}

function mkRotZMatrix(theta) {
    var s = Math.sin(theta);
    var c = Math.cos(theta);
    return mat4(c, -s, 0, 0,
                s,  c, 0, 0,
                0,  0, 1, 0,
                0,  0, 0, 1);
}

function mkRotXMatrix(theta) {
    var s = Math.sin(theta);
    var c = Math.cos(theta);
    return mat4(1, 0,  0, 0,
                0, c, -s, 0,
                0, s,  c, 0,
                0, 0,  0, 1);

}

function mkRotYMatrix(theta) {
    var s = Math.sin(theta);
    var c = Math.cos(theta);
    return mat4( c, 0, s, 0,
                 0, 1, 0, 0,
                -s, 0, c, 0,
                 0, 0, 0, 1);
}

function mkScaleMatrix(svec) {
    return mat4(svec[0], 0,       0,       0,
                 0,      svec[1], 0,       0,
                 0,      0,       svec[2], 0,
                 0,      0,       0,       1);
}

function mkHorizMirrorMatrix() {
    return mkScaleMatrix(-1, 1, 1);
}

function mkVertMirrorMatrix() {
    return mkScaleMatrix(1, -1, 1);
}

function mkHorizVertMirrorMatrix() {
    return mkScaleMatrix(-1, -1, 0);
}

function mkShearXMatrix(theta) {
    var cot = Math.cot(theta);
    return mat4(1, cot, 0, 0,
                0,   1, 0, 0,
                0,   0, 1, 0,
                0,   0, 0, 1);
}

function mkModelMatrix(model) {
    var T = mkTranslationMatrix(model.position);
    // todo: replace Rx, Ry, Rz by lookAt!!
    var Rx = mkRotXMatrix(model.rotation[0]);
    var Ry = mkRotYMatrix(model.rotation[1]);
    var Rz = mkRotZMatrix(model.rotation[2]);
    var S = mkScaleMatrix(model.scale);

    var R = mult(Ry, Rz);
    R = mult(Rx, R);

    var M = mult(R, S);
    M = mult(T, M);

    return M;
}


function divideTriangle(a, b, c, count, vertices) {
    // check for recursion
    if (count == 0) {
        vertices.push(a, b, c);
    } else {
        // bisect the sides
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        // subdivide
        divideTriangle( a, ab, ac, count - 1, vertices);
        divideTriangle( c, ac, bc, count - 1, vertices);
        divideTriangle( b, bc, ab, count - 1, vertices);
        divideTriangle(ab, ac, bc, count - 1, vertices);
    }
}