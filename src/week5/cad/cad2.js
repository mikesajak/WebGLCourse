"use strict";

var gl;

Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
}

Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
}

var CubeModel2 = {
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

var CubeModel = {
    name: "Cube",
    vertices: [
      // Front face
      vec3(-1.0, -1.0,  1.0),
      vec3( 1.0, -1.0,  1.0),
      vec3( 1.0,  1.0,  1.0),
      vec3(-1.0,  1.0,  1.0),

      // Back face
      vec3(-1.0, -1.0, -1.0),
      vec3(-1.0,  1.0, -1.0),
      vec3( 1.0,  1.0, -1.0),
      vec3( 1.0, -1.0, -1.0),

      // Top face
      vec3(-1.0,  1.0, -1.0),
      vec3(-1.0,  1.0,  1.0),
      vec3( 1.0,  1.0,  1.0),
      vec3( 1.0,  1.0, -1.0),

      // Bottom face
      vec3(-1.0, -1.0, -1.0),
      vec3( 1.0, -1.0, -1.0),
      vec3( 1.0, -1.0,  1.0),
      vec3(-1.0, -1.0,  1.0),

      // Right face
      vec3( 1.0, -1.0, -1.0),
      vec3( 1.0,  1.0, -1.0),
      vec3( 1.0,  1.0,  1.0),
      vec3( 1.0, -1.0,  1.0),

      // Left face
      vec3(-1.0, -1.0, -1.0),
      vec3(-1.0, -1.0,  1.0),
      vec3(-1.0,  1.0,  1.0),
      vec3(-1.0,  1.0, -1.0)
    ],
    faces: [
      vec3(0,  1,  2),      vec3(0,  2,  3),    // front
      vec3(4,  5,  6),      vec3(4,  6,  7),    // back
      vec3(8,  9,  10),     vec3(8,  10, 11),   // top
      vec3(12, 13, 14),     vec3(12, 14, 15),   // bottom
      vec3(16, 17, 18),     vec3(16, 18, 19),   // right
      vec3(20, 21, 22),     vec3(20, 22, 23)    // left
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
        vec3(0, 2, 1),
        vec3(0, 3, 2),
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
        vec3(0, 2, 1),
        vec3(0, 3, 2),
        vec3(0, 4, 3),
        vec3(0, 1, 4),

        vec3(5, 1, 2),
        vec3(5, 2, 3),
        vec3(5, 3, 4),
        vec3(5, 4, 1)
    ]
}

var basePlaneGrid = {
    vertices : [],

    vertexPosBuffer : null
}

var displayOptions = {
    showBasePlaneGrid: true,
    showWireframe: true,
    drawNormals: false,
    useLighting: true
};

var renderFunc = null;

var modelTypes = [];
var modelInstances = [];

var selectedModelName = null;
var selectedCamera = null;

var selModelChooser = null;
var modelTypeChooser = null;
var modelPropertyWidgets = [];

var sheetColor = vec4(0.8, 0.8, 0.8, 1)
var planeGridColor = vec4(0.6, 0.6, 0.6, 1)
var defaultFaceColor = vec4(1, 1, 1, 1)
var selectedFaceColor = vec4(1, 0, 0, 0.1)
var wireframeColor = vec4(0.4, 0.4, 0.4, 1)

var globalAmbient = vec4(0.3, 0.3, 0.3, 1);

var workBuffer;

var defaultMaterial = {
    ambient: vec3(0.5, 0.5, 0.5),
    diffuse: vec3(0.5, 0.5, 0.5),
    specular: vec3(1.0, 1.0, 1.0),
    shininess: 50
}

var lights = [
    {
        enabled: true,
        position: vec4(10, 5, 10, 1),
        diffuse : vec3(0.2, 0.9, 0.9),
        specular: vec3(1.0, 0, 0)
    }
];

var MAX_NUM_LIGHTS = 8;


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
    var vertexLightingShaderVars = initLightingShaderVars("vertex-shader-vertex-lighting", "fragment-shader-simple");

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
    var at = camera.at;
    if (arraysEqual(camera.eye, camera.at)) { // prevent error on this special case
        at = add(camera.eye(0, 0, -1));
    }
    camera.viewMatrix = lookAt(camera.eye, at, camera.up);

    workBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, workBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(200 * sizeof['vec3']), gl.DYNAMIC_DRAW);


    renderFunc = function() {
        render(shaderVars, vertexLightingShaderVars, camera, basePlaneGrid);
//        window.requestAnimFrame(renderFunc);
    };

    window.requestAnimFrame(renderFunc);
}

function render(simpleShaderVars, lightingShaderVars, camera, basePlaneGrid) {
    gl.clearColor(sheetColor[0], sheetColor[1], sheetColor[2], sheetColor[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var at = camera.at;
    if (arraysEqual(camera.eye, camera.at)) { // prevent error on this special case
        at = add(camera.eye(0, 0, -1));
    }
    camera.viewMatrix = lookAt(camera.eye, at, camera.up);

    gl.useProgram(simpleShaderVars.program);
    gl.uniformMatrix4fv(simpleShaderVars.projectionMatrix, false, flatten(camera.projectionMatrix));

    gl.useProgram(lightingShaderVars.program);
    gl.uniformMatrix4fv(lightingShaderVars.projectionMatrix, false, flatten(camera.projectionMatrix));

    if (displayOptions.showBasePlaneGrid) {
        prepareFlatShaderForModel(simpleShaderVars, camera.viewMatrix, basePlaneGrid);
        drawModelItems(basePlaneGrid, gl.LINES);
    }

    for (var modelName in modelInstances) {
        var model = modelInstances[modelName];
//        console.log("Rendering model: " + modelName + "\n" + JSON.stringify(model, null, 2))

        var modelViewMatrix = mult(camera.viewMatrix, mkModelMatrix(model));

        gl.enable(gl.POLYGON_OFFSET_FILL);
        if (displayOptions.useLighting) {
            var normalMatrix = calcNormalMatrix(modelViewMatrix);
            prepareLightingShaderForModel(lightingShaderVars, modelViewMatrix, camera.viewMatrix, normalMatrix, model, globalAmbient, lights);
        } else {
            prepareFlatShaderForModel(simpleShaderVars, modelViewMatrix, model);
        }
        drawModelItems(model, gl.TRIANGLES);
        gl.disable(gl.POLYGON_OFFSET_FILL);

        if (displayOptions.showWireframe) {
            prepareFlatShaderForModel(simpleShaderVars, modelViewMatrix, model, wireframeColor);
            drawModelWireframe(model);
        }

        if (model.name == selectedModelName) {
            // todo: create and update bounding box data only on selection change and/or selected model/camera changes
            var aabbModel = createAABBForModel(simpleShaderVars, model);
            prepareFlatShaderForModel(simpleShaderVars, modelViewMatrix, aabbModel);

            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            gl.drawArrays(gl.LINES, 0, aabbModel.vertices.length);
            gl.disable(gl.BLEND);
        }

        if (displayOptions.drawNormals) {
            // todo: move to function, optimize, etc...
            var normalsModel = {
                name: "aabb",
                vertices: [ vec3(), vec3() ],
                vertexPosBuffer: {id: workBuffer, itemSize: 3, numItems: 2},
                color: vec4(1,1,1,1)
            }
            for (var i = 0; i < model.model.normals.length; i++) {
                var normal = scale(0.3, model.model.normals[i]);
                normalsModel.vertices[0] = model.model.vertices[i];
                normalsModel.vertices[1] = add(model.model.vertices[i], normal);
                gl.useProgram(simpleShaderVars.program);
                gl.bindBuffer(gl.ARRAY_BUFFER, workBuffer);
                for (var j = 0; j < normalsModel.vertices.length; j++) {
                    gl.bufferSubData(gl.ARRAY_BUFFER, j* sizeof['vec3'], flatten(normalsModel.vertices[j]));
                }

                gl.vertexAttribPointer(simpleShaderVars.vPosition, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(simpleShaderVars.vPosition);

                prepareFlatShaderForModel(simpleShaderVars, modelViewMatrix, normalsModel);
                gl.drawArrays(gl.LINES, 0, 2);
            }
        }
    }
}


function createAABBForModel(shaderVars, model) {
    var aabb = boundingBox(model.model.vertices, mat4(), 0.1);
    var segLen = 0.3;
    var aabbVertices = [
        // front
        //vec3(aabb.min[0], aabb.min[1], aabb.min[2]),    vec3(aabb.max[0], aabb.min[1], aabb.min[2]),
        vec3(aabb.min[0], aabb.min[1], aabb.min[2]),    vec3(aabb.min[0]+segLen, aabb.min[1], aabb.min[2]),
        vec3(aabb.min[0], aabb.min[1], aabb.min[2]),    vec3(aabb.min[0], aabb.min[1]+segLen, aabb.min[2]),
        vec3(aabb.min[0], aabb.min[1], aabb.min[2]),    vec3(aabb.min[0], aabb.min[1], aabb.min[2]+segLen),

        //vec3(aabb.max[0], aabb.min[1], aabb.min[2]),    vec3(aabb.max[0], aabb.max[1], aabb.min[2]),
        vec3(aabb.max[0], aabb.min[1], aabb.min[2]),    vec3(aabb.max[0]-segLen, aabb.min[1], aabb.min[2]),
        vec3(aabb.max[0], aabb.min[1], aabb.min[2]),    vec3(aabb.max[0], aabb.min[1]+segLen, aabb.min[2]),
        vec3(aabb.max[0], aabb.min[1], aabb.min[2]),    vec3(aabb.max[0], aabb.min[1], aabb.min[2]+segLen),

        //vec3(aabb.max[0], aabb.max[1], aabb.min[2]),    vec3(aabb.min[0], aabb.max[1], aabb.min[2]),
        vec3(aabb.max[0], aabb.max[1], aabb.min[2]),    vec3(aabb.max[0]-segLen, aabb.max[1], aabb.min[2]),
        vec3(aabb.max[0], aabb.max[1], aabb.min[2]),    vec3(aabb.max[0], aabb.max[1]-segLen, aabb.min[2]),
        vec3(aabb.max[0], aabb.max[1], aabb.min[2]),    vec3(aabb.max[0], aabb.max[1], aabb.min[2]+segLen),

        //vec3(aabb.min[0], aabb.max[1], aabb.min[2]),    vec3(aabb.min[0], aabb.min[1], aabb.min[2]),
        vec3(aabb.min[0], aabb.max[1], aabb.min[2]),    vec3(aabb.min[0]+segLen, aabb.max[1], aabb.min[2]),
        vec3(aabb.min[0], aabb.max[1], aabb.min[2]),    vec3(aabb.min[0], aabb.max[1]-segLen, aabb.min[2]),
        vec3(aabb.min[0], aabb.max[1], aabb.min[2]),    vec3(aabb.min[0], aabb.max[1], aabb.min[2]+segLen),

        // back
        //vec3(aabb.min[0], aabb.min[1], aabb.max[2]),    vec3(aabb.max[0], aabb.min[1], aabb.max[2]),
        vec3(aabb.min[0], aabb.min[1], aabb.max[2]),    vec3(aabb.min[0]+segLen, aabb.min[1], aabb.max[2]),
        vec3(aabb.min[0], aabb.min[1], aabb.max[2]),    vec3(aabb.min[0], aabb.min[1]+segLen, aabb.max[2]),
        vec3(aabb.min[0], aabb.min[1], aabb.max[2]),    vec3(aabb.min[0], aabb.min[1], aabb.max[2]-segLen),

        //vec3(aabb.max[0], aabb.min[1], aabb.max[2]),    vec3(aabb.max[0], aabb.max[1], aabb.max[2]),
        vec3(aabb.max[0], aabb.min[1], aabb.max[2]),    vec3(aabb.max[0]-segLen, aabb.min[1], aabb.max[2]),
        vec3(aabb.max[0], aabb.min[1], aabb.max[2]),    vec3(aabb.max[0], aabb.min[1]+segLen, aabb.max[2]),
        vec3(aabb.max[0], aabb.min[1], aabb.max[2]),    vec3(aabb.max[0], aabb.min[1], aabb.max[2]-segLen),

        //vec3(aabb.max[0], aabb.max[1], aabb.max[2]),    vec3(aabb.min[0], aabb.max[1], aabb.max[2]),
        vec3(aabb.max[0], aabb.max[1], aabb.max[2]),    vec3(aabb.max[0]-segLen, aabb.max[1], aabb.max[2]),
        vec3(aabb.max[0], aabb.max[1], aabb.max[2]),    vec3(aabb.max[0], aabb.max[1]-segLen, aabb.max[2]),
        vec3(aabb.max[0], aabb.max[1], aabb.max[2]),    vec3(aabb.max[0], aabb.max[1], aabb.max[2]-segLen),

        //vec3(aabb.min[0], aabb.max[1], aabb.max[2]),    vec3(aabb.min[0], aabb.min[1], aabb.max[2]),
        vec3(aabb.min[0], aabb.max[1], aabb.max[2]),    vec3(aabb.min[0]+segLen, aabb.max[1], aabb.max[2]),
        vec3(aabb.min[0], aabb.max[1], aabb.max[2]),    vec3(aabb.min[0], aabb.max[1]-segLen, aabb.max[2]),
        vec3(aabb.min[0], aabb.max[1], aabb.max[2]),    vec3(aabb.min[0], aabb.max[1], aabb.max[2]-segLen)
    ];

    gl.useProgram(shaderVars.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, workBuffer);
    for (var i = 0; i < aabbVertices.length; i++) {
        gl.bufferSubData(gl.ARRAY_BUFFER, i* sizeof['vec3'], flatten(aabbVertices[i]));
    }

    gl.vertexAttribPointer(shaderVars.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.vPosition);
    return {
        name: "aabb",
        vertices: aabbVertices,
        vertexPosBuffer: {id: workBuffer, itemSize: 3, numItems: aabbVertices.length},

        color: vec4(1, 0, 0, 0.7)
    };
}

function calcNormalMatrix(modelViewMatrix) {
    var N = mat3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2],
                 modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2],
                 modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2]);
    N = transpose(inverseMat3(N));
    return N;
}

function prepareFlatShaderForModel(shaderVars, modelViewMatrix, model, forceColor) {
    gl.useProgram(shaderVars.program);

    gl.uniformMatrix4fv(shaderVars.modelViewMatrix, false, flatten(modelViewMatrix));

    var color = forceColor != null ? forceColor :
                    (isValid(model.material) ? model.material.diffuse : model.color);
    gl.uniform4f(shaderVars.uColor, color[0], color[1], color[2], color[3]);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexPosBuffer.id);
    gl.enableVertexAttribArray(shaderVars.vPosition);
    gl.vertexAttribPointer(shaderVars.vPosition, model.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if (isValid(model.vertexColorBuffer)) {
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexColorBuffer.id);
        gl.vertexAttribPointer(shaderVars.vColor, model.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
}

function prepareShaderLightData(shaderVars, lightNum, light) {
    gl.uniform1i(shaderVars.lights[lightNum].enabled,  light.enabled);
    gl.uniform4f(shaderVars.lights[lightNum].position, light.position[0], light.position[1], light.position[2], light.position[3]);
    gl.uniform3f(shaderVars.lights[lightNum].diffuse,  light.diffuse[0],  light.diffuse[1],  light.diffuse[2]);
    gl.uniform3f(shaderVars.lights[lightNum].specular, light.specular[0], light.specular[1], light.specular[2]);
}

function prepareShaderMaterialData(shaderVars, material) {
    gl.uniform3f(shaderVars.material.ambient, material.ambient[0], material.ambient[1], material.ambient[2]);
    gl.uniform3f(shaderVars.material.diffuse, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
    gl.uniform3f(shaderVars.material.specular, material.specular[0], material.specular[1], material.specular[2]);
    gl.uniform1f(shaderVars.material.shininess, material.shininess);
}

function prepareLightingShaderForModel(shaderVars, modelViewMatrix, viewMatrix, normalMatrix, model, globalAmbient, lights) {
    gl.useProgram(shaderVars.program);

    gl.uniformMatrix4fv(shaderVars.modelViewMatrix, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(shaderVars.viewMatrix, false, flatten(viewMatrix));
    gl.uniformMatrix3fv(shaderVars.normalMatrix, false, flatten(normalMatrix));

    gl.uniform3f(shaderVars.globalAmbient, globalAmbient[0], globalAmbient[1], globalAmbient[2]);
    var lightNum = 0;
    for (; lightNum < lights.length && lightNum < MAX_NUM_LIGHTS; lightNum++) {
        prepareShaderLightData(shaderVars, lightNum, lights[lightNum]);
    }
    // set remaining lights to disabled
    for (; lightNum < MAX_NUM_LIGHTS; lightNum++) {
        prepareShaderLightData(shaderVars, lightNum, { enabled: false, position: vec4(0,0,0,0), diffuse: vec3(0,0,0), specular: vec3(0,0,0)});
    }

    prepareShaderMaterialData(shaderVars, defaultMaterial);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexPosBuffer.id);
    gl.enableVertexAttribArray(shaderVars.vPosition);
    gl.vertexAttribPointer(shaderVars.vPosition, model.vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexNormalBuffer.id);
    gl.enableVertexAttribArray(shaderVars.vNormal);
    gl.vertexAttribPointer(shaderVars.vNormal, model.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
}

function drawModelItems(model, renderMode) {
    if (isValid(model.faceIndexBuffer)) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.faceIndexBuffer.id);
        gl.drawElements(renderMode, model.faceIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    } else {
        gl.drawArrays(renderMode, 0, model.vertexPosBuffer.numItems / model.vertexPosBuffer.itemSize);
    }
}

function drawModelWireframe(model) {
    if (isValid(model.faceIndexBuffer)) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.faceIndexBuffer.id);
        for (var i = 0; i < model.faceIndexBuffer.numItems / 3; i++) {
            gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i * 3 * model.faceIndexBuffer.itemSize);
        }
    } else {
        var numVertices = model.vertexPosBuffer.numItems / model.vertexPosBuffer.itemSize / 3;
        for (var i = 0; i < numVertices; i++) {
            gl.drawArrays(gl.LINE_LOOP, i*3, 3);
        }
    }
}

function initShaderVars(vertexShader, fragmentShader) {
    console.log("initShaderVars: vertexShader=" + vertexShader + ", framentShader=" + fragmentShader);
    var program = initShaders(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    var shaderVars =  {
        program: program,
        vPosition : gl.getAttribLocation(program, "vPosition"),
//        vColor : gl.getAttribLocation(program, "vColor"),

        projectionMatrix : gl.getUniformLocation(program, "uProjectionMatrix"),
        modelViewMatrix : gl.getUniformLocation(program, "uModelViewMatrix"),

        uForceColor : gl.getUniformLocation(program, "uForceColor"),
        uColor : gl.getUniformLocation(program, "uColor")
    };

//    gl.enableVertexAttribArray(shaderVars.vPosition);
//    gl.enableVertexAttribArray(shaderVars.vColor);

    console.log("shaderVars: " + JSON.stringify(shaderVars));
    return shaderVars;
}

function initLightingShaderVars(vertexShader, fragmentShader) {
    console.log("initLightingShaderVars: vertexShader=" + vertexShader + ", framentShader=" + fragmentShader);
    var program = initShaders(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    var shaderVars =  {
        program: program,
        vPosition : gl.getAttribLocation(program, "vPosition"),
        vNormal : gl.getAttribLocation(program, "vNormal"),

        projectionMatrix : gl.getUniformLocation(program, "uProjectionMatrix"),
        modelViewMatrix : gl.getUniformLocation(program, "uModelViewMatrix"),
        viewMatrix : gl.getUniformLocation(program, "uViewMatrix"),
        normalMatrix : gl.getUniformLocation(program, "uNormalMatrix"),

        material : {
            ambient: gl.getUniformLocation(program, "uMaterial.ambient"),
            diffuse: gl.getUniformLocation(program, "uMaterial.diffuse"),
            specular: gl.getUniformLocation(program, "uMaterial.specular"),
            shininess: gl.getUniformLocation(program, "uMaterial.shininess"),
        },

        lights : gl.getUniformLocation(program, "uLights"),
        globalAmbient : gl.getUniformLocation(program, "uGlobalAmbient")
    };

    shaderVars.lights = [];
    for (var i = 0; i < MAX_NUM_LIGHTS; i++) {
        shaderVars.lights.push({
            enabled: gl.getUniformLocation(program, "uLights[" + i + "].enabled"),
            position: gl.getUniformLocation(program, "uLights[" + i + "].position"),
            diffuse: gl.getUniformLocation(program, "uLights[" + i + "].diffuse"),
            specular: gl.getUniformLocation(program, "uLights[" + i + "].specular")
        });
    }

//    gl.enableVertexAttribArray(shaderVars.vPosition);
//    gl.enableVertexAttribArray(shaderVars.vNormal);

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
            var model = selectorFunc();
            if (model != null) {
                var value = conversion != null ? conversion(widget.value) : widget.value;
                model[property][index] = value;
                window.requestAnimFrame(renderFunc);
            }
            changing = false;
        }
    };
    return widget;
}

function isActiveClassSet(classStr) {
    return classStr.search(/(^|\s)active(\s|$)/) == "active";
}

function linkToggleButonVar(buttonId, variables, variable, repaint) {
    var button = document.getElementById(buttonId);
    var oldOnClick = button.onclick;
    button.onclick = function() {
        if (isValid(oldOnClick)) {
            oldOnClick();
        }

        variables[variable] = isActiveClassSet(button.className);

        if (repaint) {
            window.requestAnimFrame(renderFunc);
        }
    };
    variables[variable] = isActiveClassSet(button.className);
}


function installGuiHandlers(shaderVars) {
//    var showGridCheckbox = document.getElementById("showGridCheckbox");
//    showGridCheckbox.onclick = function() {
//        displayOptions.showBasePlaneGrid = showGridCheckbox.checked;
//        window.requestAnimFrame(renderFunc);
//    }
//    displayOptions.showBasePlaneGrid = showGridCheckbox.checked;


//    var showWireframeCheckbox = document.getElementById("showWireframeCheckbox");
//    showWireframeCheckbox.onclick = function() {
//        showWireframe = showWireframeCheckbox.checked;
//        window.requestAnimFrame(renderFunc);
//    }
//    showWireframe = showWireframeCheckbox.checked;

//    var drawNormalsCheckbox = document.getElementById("drawNormalsCheckbox");
//    drawNormalsCheckbox.onclick = function() {
//        drawNormals = drawNormalsCheckbox.checked;
//        window.requestAnimFrame(renderFunc);
//    }
//    drawNormals = drawNormalsCheckbox.checked;

    linkToggleButonVar("showGridButton", displayOptions, "showBasePlane", true);
    linkToggleButonVar("showWireframeButton", displayOptions, "showWireframe", true);
    linkToggleButonVar("showNormalsButton", displayOptions, "drawNormals", true);

    // camera position
    var camXPosSlider = linkGUIModelProperty("camXPosSlider", cameraSelector, "eye", 0);
    var camYPosSlider = linkGUIModelProperty("camYPosSlider", cameraSelector, "eye", 1);
    var camZPosSlider = linkGUIModelProperty("camZPosSlider", cameraSelector, "eye", 2);
    selectedCamera.eye = vec3(camXPosSlider.value, camYPosSlider.value, camZPosSlider.value);

//    var enableLightingCheckbox = document.getElementById("enableLightingCheckbox");
//    enableLightingCheckbox.onclick = function() {
//        useLighting = enableLightingCheckbox.checked;
//        window.requestAnimFrame(renderFunc);
//    }
//    useLighting = enableLightingCheckbox.checked;
    linkToggleButonVar("enableLightingButton", displayOptions, "useLighting", true);
//
//    var lightingModelChooser = document.getElementById("lightingModelChooser");
//    lightingModelChooser.onchange = function() {
//        useLighting = lightingModelChooser.value == "lighting";
//        window.requestAnimFrame(renderFunc);
//    };
//    useLighting = lightingModelChooser.value == "lighting";

    // position

    var modelXPosSlider = linkGUIModelProperty("modelXPosSlider", modelSelector, "position", 0);
    var modelXPosText= document.getElementById("modelXPosText");
    modelPropertyWidgets.push(modelXPosSlider, modelXPosText);

    var modelYPosSlider = linkGUIModelProperty("modelYPosSlider", modelSelector, "position", 1);
    var modelYPosText = document.getElementById("modelYPosText");
    modelPropertyWidgets.push(modelYPosSlider, modelYPosText);

    var modelZPosSlider = linkGUIModelProperty("modelZPosSlider", modelSelector, "position", 2);
    var modelZPosText = document.getElementById("modelZPosText");
    modelPropertyWidgets.push(modelZPosSlider, modelZPosText);

//    var posResetButton = document.getElementById("posResetButton");
//    modelPropertyWidgets.push(posResetButton);

    // rotation

    var modelXRotSlider = linkGUIModelProperty("modelXRotSlider", modelSelector, "rotation", 0, Math.radians);
    var modelXRotSlider= document.getElementById("modelXRotSlider");
    modelPropertyWidgets.push(modelXRotSlider, modelXRotSlider);

    var modelYRotSlider = linkGUIModelProperty("modelYRotSlider", modelSelector, "rotation", 1, Math.radians);
    var modelYRotSlider = document.getElementById("modelYRotSlider");
    modelPropertyWidgets.push(modelYRotSlider, modelYRotSlider);

    var modelZRotSlider = linkGUIModelProperty("modelZRotSlider", modelSelector, "rotation", 2, Math.radians);
    var modelZRotSlider = document.getElementById("modelZRotSlider");
    modelPropertyWidgets.push(modelZRotSlider, modelZRotSlider);

//    var rotResetButton = document.getElementById("rotResetButton");
//    modelPropertyWidgets.push(rotResetButton);

    // scale
    var modelXScaleSlider = linkGUIModelProperty("modelXScaleSlider", modelSelector, "scale", 0);
    var modelXScaleText= document.getElementById("modelXScaleText");
    modelPropertyWidgets.push(modelXScaleSlider, modelXScaleText);

    var modelYScaleSlider = linkGUIModelProperty("modelYScaleSlider", modelSelector, "scale", 1);
    var modelYScaleText = document.getElementById("modelYScaleText");
    modelPropertyWidgets.push(modelYScaleSlider, modelYScaleText);

    var modelZScaleSlider = linkGUIModelProperty("modelZScaleSlider", modelSelector, "scale", 2);
    var modelZScaleText = document.getElementById("modelZScaleText");
    modelPropertyWidgets.push(modelZScaleSlider, modelZScaleText);

//    var scaleResetButton = document.getElementById("scaleResetButton");
//    modelPropertyWidgets.push(scaleResetButton);

    var selModelHandler = function() {
        selectedModelName = selModelChooser.value;
        updateModelPropertyWidgets();
        window.requestAnimFrame(renderFunc);
    }
    selModelChooser = document.getElementById("selModelChooser");
    selModelChooser.onchange = function() {
        selModelHandler()
    };

    updateModelPropertyWidgets();

    var createModelButon = document.getElementById("createModelButton");
    modelTypeChooser = document.getElementById("modelTypeChooser");

    createModelButon.onclick = function() {
        //var modelType = modelTypeChooser.value;
        var modelType = modelTypeChooser.value;
        console.log("Selected model type=" + modelType);
        var model = modelTypes[modelType];

        var modelInstance = createModelInstance(shaderVars, model);
        modelInstance.name = modelInstance.name + countProps(modelInstances);
        addModelInstance(modelInstance);

        selModelChooser.value = modelInstance.name;

        selModelHandler();
    }

    function updateModelPropertyWidgets() {
        for (var i = 0; i < modelPropertyWidgets.length; i++) {
            var selectedModel = modelInstances[selectedModelName];
            modelPropertyWidgets[i].disabled = (selectedModel == null);

            if (selectedModel != null) {
                modelXPosSlider.value = modelXPosText.value = selectedModel.position[0];
                modelYPosSlider.value = modelYPosText.value = selectedModel.position[1];
                modelZPosSlider.value = modelZPosText.value = selectedModel.position[2];

                modelXRotSlider.value = modelXRotText.value = Math.degrees(selectedModel.rotation[0]);
                modelYRotSlider.value = modelYRotText.value = Math.degrees(selectedModel.rotation[1]);
                modelZRotSlider.value = modelZRotText.value = Math.degrees(selectedModel.rotation[2]);

                modelXScaleSlider.value = modelXScaleText.value= selectedModel.scale[0];
                modelYScaleSlider.value = modelYScaleText.value= selectedModel.scale[1];
                modelZScaleSlider.value = modelZScaleText.value= selectedModel.scale[2];
            }
        }
    }
}

function installSupportedModels() {
    addModelType(generateNormals(CubeModel));
//    addModelType(generateNormals(expandModel(CubeModel)));
//    addModelType(TetraHedronModel);
//    addModelType(TetraHedronModel2);
    addModelType(generateNormals(expandModel(TetraHedronModel3)));
    addModelType(generateNormals(expandModel(OctahedronModel)));
    addModelType(generateConeModel(10, 0.5, 2));
    addModelType(generateCylinderModel(10, 0.5, 2));
    addModelType(generateSphereModel3(16, 1));
    addModelType(generateIcoSphereModel(3, 1));
}

function addModelType(model) {
    modelTypes[model.name] = model;

    //var option = document.createElement("option");
    //option.text = model.name;
    //modelTypeChooser.add(option);
    $("#modelTypeChooserOptions").append("<li><a>" + model.name + "</a></li>");
}

function addModelInstance(modelInstance) {
    modelInstances[modelInstance.name] = modelInstance;

    var option = document.createElement("option");
    option.text = modelInstance.name;
    selModelChooser.add(option);
}

function initBuffersForModel(shaderVars, model, modelInstance) {
    var vertexBufId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufId);
    var vertices = flatten(model.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderVars.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.vPosition);

    modelInstance.vertexPosBuffer = { id: vertexBufId, itemSize: 3, numItems: vertices.length };

    if (isValid(model.normals)) {
        var normalBufId = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBufId);
        var normals = flatten(model.normals);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(shaderVars.vNormal);
        modelInstance.vertexNormalBuffer = { id: normalBufId, itemSize: 3, numItems: normals.length };
    }

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
        faceIndexBuffer: null,

        model: model
    };

    initBuffersForModel(shaderVars, model, modelInstance);

    return modelInstance;
}

function generateConeModel(numPoints, radius, height) {
    console.log("generateConeModel: numPoints=" + numPoints + ", radius=" + radius + ", height=" + height);
    var model = {
        name: "Cone",
        vertices: [],
        faces: [],
        normals: []
    };

//    generateConeFan(numPoints, radius, 0, height, model.vertices, model.faces);
    // have to use cylisder strip with top radiun 0 instead of cone fan - because normals at the tip have to be different for every face
    generateCylinderStrip(numPoints, radius, 0, 0, height, model.vertices, model.faces);
    console.log("--vertices=" + JSON.stringify(model.vertices));
    var line2Offset = model.vertices.length/2;
    for (var i = 0; i < model.vertices.length/2; i++) {
        var p = model.vertices[i];
//        var v = normalize(vec3(p[0], 0, p[2]));
//        var n = vec3(v[0] * height / radius, radius/height, v[2] * height / radius);
        var n = vec3(p[0], radius*radius / height, p[2]);
        n = normalize(n);
        model.normals.push(n);
    }
    for (var i = 0; i < model.vertices.length/2; i++) {
        model.normals.push(model.normals[i]);
    }
    var i = model.normals.length;
    generateConeFan(numPoints, radius, 0, 0, model.vertices, model.faces);//, model.vertices.length - numPoints);
    for (; i < model.vertices.length; i++) {
        model.normals.push(vec3(0, -1, 0));
    }

    return model;
}

function generateCylinderModel(numPoints, radius, height) {
    console.log("generateCylinderModel: numPoints=" + numPoints + ", radius=" + radius + ", height=" + height);
    var model = {
        name: "Cylinder",
        vertices: [],
        faces: [],
        normals: []
    };

    generateConeFan(numPoints, radius, 0, 0, model.vertices, model.faces);
    var i = 0;
    for (; i < model.vertices.length; i++) {
        model.normals.push(vec3(0, -1, 0));
    }
    // note - for lighting we cannot reuse vertices between caps and side wall, because normals have to be different
    generateCylinderStrip(numPoints, radius, 0, radius, height, model.vertices, model.faces); //, model.vertices - numPoints);
    for (; i < model.vertices.length; i++) {
        var center = vec3(0, model.vertices[i][1], 0);
        model.normals.push(normalize(subtract(model.vertices[i], center)));
    }
    generateConeFan(numPoints, radius, height, 0, model.vertices, model.faces);//, -1, model.vertices - numPoints);
    for (; i < model.vertices.length; i++) {
        model.normals.push(vec3(0, 1, 0));
    }

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

    var normals = [];
    // correct all vertices to have radius - push them away/towards center to generate actual sphere
    for (var i = 0; i < resultVertices.length; i++) {
        var v = resultVertices[i];
        var normal = normalize(v);
//        var len = Math.sqrt(dot(v, v));
//        var k = radius * (1 / len);
//        var v1 = scale(k, v);

        resultVertices[i] = scale(radius, normal);

        normals.push(normal);
    }

    return {
        name : "Icosphere",
        vertices : resultVertices,
        normals: normals,
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

    model.normals = [];
    for (var i = 0; i < model.vertices.length; i++) {
        model.normals.push(normalize(model.vertices[i]));
    }

    return model;
}

function genCircleXZVertices(radius, yPos, numPoints, vertices) {
//    console.log("--genCircleXZVertices: radius=" + radius + ", yPos=" + yPos + ", numPoints=" + numPoints + ", vertices.len=" + vertices.length);
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

//    console.log("generateStrip: row1StartIdx=" + row1StartIdx + ", row2StartIdx=" + row2StartIdx);

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
//    console.log("generateConeFan: numSteps=" + numSteps + ", radius=" + radius + ", yPos=" + yPos + ", height=" + height);
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
        gridPoints.push(vec3(minX, y, z),  vec3(maxX, y, z));
        gridPoints.push(vec3(x, y, minZ),  vec3(x, y, maxZ));
        x += stepX
        z += stepZ
    }

    gridPoints.push(vec3(minX, y, maxZ),  vec3(maxX, y, maxZ));
    gridPoints.push(vec3(maxX, y, minZ),  vec3(maxX, y, maxZ));

    return gridPoints;
}

function generateBasePlane(shaderVars, N, stepX, stepZ, y) {
    var basePlaneGrid = {
        name : "Base plane grid",
        vertices : generateGrid(N, stepX, stepZ, y),

        color : planeGridColor,
        vertexPosBuffer : null
    }

    var vertexBufId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufId)
    var vertices = flatten(basePlaneGrid.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(shaderVars.vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.vPosition);
    basePlaneGrid.vertexPosBuffer = { id: vertexBufId, itemSize: 3, numItems: vertices.length };
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

function expandModel(model, useFaceIndexing) {
    var vertices = [];
    var faces = [];
    for (var i = 0; i < model.faces.length; i++) {
        if (useFaceIndexing) {
            faces.push(vec3(vertices.length, vertices.length+1, vertices.length+2));
        }
        var face = model.faces[i];
        vertices.push(model.vertices[face[0]]);
        vertices.push(model.vertices[face[1]]);
        vertices.push(model.vertices[face[2]]);
    }

    var expandedModel = {
        name: model.name,
        vertices: vertices
    };
    if (useFaceIndexing) {
        expandedModel.faces = faces;
    }

    console.log("Expanded model: {"
                    + "name: " + expandedModel.name + ", "
                    + "vertices: len=" + expandedModel.vertices.length + ", "
                    + "faces: " + expandedModel.faces
                    + " }");

    return expandedModel;
}

function generateNormals2(model) {
    var normals = [];
    if (isValid(model.faces)) {
        for (var i = 0; i < model.faces.length; i++) {
            var face = model.faces[i];
            normals.push(calcNormal(model.vertices[face[0]], model.vertices[face[1]], model.vertices[face[2]]));
            normals.push(calcNormal(model.vertices[face[0]], model.vertices[face[1]], model.vertices[face[2]]));
            normals.push(calcNormal(model.vertices[face[0]], model.vertices[face[1]], model.vertices[face[2]]));
        }
    } else {
        for (var i = 0; i < model.vertices.length; i += 3) {
            normals.push(calcNormal(model.vertices[i], model.vertices[i+1], model.vertices[i+2]));
            normals.push(calcNormal(model.vertices[i], model.vertices[i+1], model.vertices[i+2]));
            normals.push(calcNormal(model.vertices[i], model.vertices[i+1], model.vertices[i+2]));
        }
    }

    model.normals = normals;
    return model;
}

function generateNormals(model) {
    var normals = [];

    if (isValid(model.faces)) {
        var normals = new Array(model.vertices.length);
        for (var i = 0; i < model.faces.length; i++) {
            var face = model.faces[i];
            normals[face[0]] = calcNormal(model.vertices[face[0]], model.vertices[face[1]], model.vertices[face[2]]);
            normals[face[1]] = calcNormal(model.vertices[face[0]], model.vertices[face[1]], model.vertices[face[2]]);
            normals[face[2]] = calcNormal(model.vertices[face[0]], model.vertices[face[1]], model.vertices[face[2]]);
        }
    } else {
        for (var i = 0; i < model.vertices.length; i += 3) {
            normals.push(calcNormal(model.vertices[i], model.vertices[i+1], model.vertices[i+2]));
            normals.push(calcNormal(model.vertices[i], model.vertices[i+1], model.vertices[i+2]));
            normals.push(calcNormal(model.vertices[i], model.vertices[i+1], model.vertices[i+2]));
        }
    }
    model.normals = normals;
    return model;
}

function calcNormal(v0, v1, v2) {
    var u = subtract(v1, v0);
    var v = subtract(v2, v0);

    return normalize(vec3(u[1] * v[2] - u[2] * v[1],
                          u[2] * v[0] - u[0] * v[2],
                          u[0] * v[1] - u[1] * v[0]));
}

function detMat3(M) {
    return M[0][0]*M[1][1]*M[2][2] + M[0][1]*M[1][2]*M[2][0] + M[0][2]*M[1][0]*M[2][1] -
           M[0][0]*M[1][2]*M[2][1] - M[0][2]*M[1][1]*M[2][0] - M[0][1]*M[1][0]*M[2][2];
}

function inverseMat3(M) {
    var Mi = mat3(M[1][1]*M[2][2] - M[2][1]*M[1][2],    M[2][1]*M[0][2] - M[0][1]*M[2][2],    M[0][1]*M[1][2] - M[1][1]*M[0][2],
                  M[2][0]*M[1][2] - M[1][0]*M[2][2],    M[0][0]*M[2][2] - M[2][0]*M[0][2],    M[1][0]*M[0][2] - M[0][0]*M[1][2],
                  M[1][0]*M[2][1] - M[2][0]*M[1][1],    M[2][0]*M[0][1] - M[0][0]*M[2][1],    M[0][0]*M[1][1] - M[1][0]*M[0][1]);
    var detM = detMat3(M);
    Mi = scaleMat(1/detM, Mi);
    return Mi;
}

function mkMatBySize(M) {
    switch(M.length) {
        case 2: return mat2();
        case 3: return mat3();
        case 4: return mat4();
        default:
            throw "Invalid matrix size: " + len;
    }}

function transpose(M) {
    var len = M.length;
    var Mt = mkMatBySize(M);

    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            Mt[j][i] = M[i][j];
        }
    }

    return Mt;
}

function scaleMat(a, M) {
    var Ms = mkMatBySize(M);
    for (var i = 0; i < M.length; i++) {
        for (var j = 0; j < M.length; j++) {
            Ms[i][j] = a * M[i][j];
        }
    }
    return Ms;
}

function boundingBox(vertices, M, offset) {
    var v = transform(vec4(vertices[0][0], vertices[0][1], vertices[0][2], 1), M);
    var min = vec3(v[0], v[1], v[2]);
    var max = vec3(v[0], v[1], v[2]);
    for (var i = 1; i < vertices.length; i++) {
        v = transform(vec4(vertices[i][0], vertices[i][1], vertices[i][2], 1), M);

//        console.log("v=" + JSON.stringify(v) + ", min=" + JSON.stringify(min) + ", max=" + JSON.stringify(max));

        for (var j = 0; j < 3; j++) {
            if (v[j] < min[j]) {
                min[j] = v[j];
            }
            if (v[j] > max[j]) {
                max[j] = v[j];
            }
        }
    }

    if (isValid(offset)) {
        min = subtract(min, vec3(offset, offset, offset));
        max = add(max, vec3(offset, offset, offset));
    }

    return {
        min: min,
        max: max
    };
}

function transform(v, M) {
    var v2 = vec4(0,0,0,0);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            v2[i] += v[j]*M[i][j];
        }
    }
    return v2;
}

function arraysEqual(a1, a2) {
    return a1.length == a2.length && a1.every(function(v,i) { return v == a2[i]});
}