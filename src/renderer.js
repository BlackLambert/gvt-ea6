// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Renderer
{
    constructor()
    {

        // ------------------------------------------
        // Creating webgl context
        // ------------------------------------------

        const canvasID = "wgl-canvas";
        this.gl = createGLContext(canvasID);

        // ------------------------------------------
        // Defining vertex and fragment shaders
        // ------------------------------------------

        // Using the glsl-literal extension for shader syntax highlighting
        const glsl = x => x;

        const vertexShaderRaw = glsl`
            attribute vec4 position; 
            attribute vec4 color;
            uniform mat4 matrix;

            varying vec4 vertexColor;
            void main(void) {
                vec4 pos = matrix * position;
                gl_Position = pos;
                vertexColor = color;
            }
        `;

        const fragementShaderRaw = glsl`
            precision mediump float;
            varying vec4 vertexColor;

            void main(void) {
                gl_FragColor = vertexColor;
            }
        `;

        // ------------------------------------------
        // Initializes Shader
        // ------------------------------------------

        let vertexShader;
        let fragmentShader;

        vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderRaw);
        fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragementShaderRaw);

        // ------------------------------------------
        // Initializes Programm
        // ------------------------------------------

        let program;

        program = createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(program);
        
        // ------------------------------------------
        // Initializes Shader Attribute Location
        // ------------------------------------------

        this.glPositionAttributeLocation = this.gl.getAttribLocation(program, "position");
        this.glColorAttributeLocation = this.gl.getAttribLocation(program, "color");
        this.glMatrixLocation = this.gl.getUniformLocation(program, "matrix");
        
        // ------------------------------------------
        // Create buffers
        // ------------------------------------------

        this.vertexBuffer = this.gl.createBuffer();
        this.triangleColorBuffer = this.gl.createBuffer();
        this.lineColorBuffer = this.gl.createBuffer();
        this.triangleIndicesBuffer = this.gl.createBuffer();
        this.lineIndicesBuffer = this.gl.createBuffer();
    }

    render(scene)
    {
        this.drawScene(scene);

    }

    drawScene(scene)
    {
        this.initView(scene)
        for(let i = 0; i < scene.glObjects.length; i++)
        {
            let obj = scene.glObjects[i];
            this.draw(obj, scene.camera);
        }
    }

    initView(scene)
    {
        resizeCanvas(this.gl.canvas);
        this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height);
        this.gl.clearColor(scene.clearColor[0], scene.clearColor[1], scene.clearColor[2], scene.clearColor[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Backface Culling
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    createOrthographicProjectionMatrix(camera)
    {
        const left = 0;
        const right = this.gl.canvas.clientWidth;
        const bottom = this.gl.canvas.clientHeight;
        const top = 0;
        const near = camera.near;
        const far = camera.far;
        let result = Matrix.createOrthographic(left, right, bottom, top, near, far);

        const distanceDownsizingFactor = 1;
        let zToWMatrix = Matrix.createZToWMatrix(distanceDownsizingFactor);

        result = result.multiply(zToWMatrix);
        return result;
    }

    createPerspectiveProjectionMatrix(camera)
    {
        const fieldOfView = camera.fieldOfView;
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const near = camera.near;
        const far = camera.far;
        return Matrix.createPerspective(angleToRadians(fieldOfView), aspect, near, far);
    }

    draw(glObject, camera)
    {
        //console.log(camera);
        let transformationMatrix = glObject.transformationMatrix();
        let projectionMatrix = this.createPerspectiveProjectionMatrix(camera);
        let viewMatrix = camera.viewMatrix;


        let matrix = transformationMatrix;
        matrix = matrix.multiply(viewMatrix);
        matrix = matrix.multiply(projectionMatrix);
        this.gl.uniformMatrix4fv(this.glMatrixLocation, false, matrix.elements);
        this.bindVertices(glObject);

        // Drawing triangles
        this.bindAreaColors(glObject);
        this.bindTriangles(glObject);
        this.gl.drawElements(this.gl.TRIANGLES, this.triangleIndicesCount, this.gl.UNSIGNED_SHORT,0);

        // Drawing lines
        this.bindLineColors(glObject);
        this.bindLines(glObject);
        this.gl.drawElements(this.gl.LINES, this.linesIndicesCount, this.gl.UNSIGNED_SHORT,0);
    }


    bindVertices(glObject)
    {
        let vertices = glObject.verticePositions;
        //console.log(vertices);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.glPositionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.glPositionAttributeLocation);
    }

    bindTriangles(glObject)
    {
        let triangles = glObject.faceIndices(0);
        this.triangleIndicesCount = triangles.length;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleIndicesBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), this.gl.STATIC_DRAW);
    }

    bindLines(glObject)
    {
        let lines = glObject.wireframeIndices(0);
        this.linesIndicesCount = lines.length;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineIndicesBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), this.gl.STATIC_DRAW);
    }

    bindAreaColors(glObject)
    {
        let colors = glObject.faceColorValues;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.glColorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.glColorAttributeLocation);
    }

    bindLineColors(glObject)
    {
        let colors = glObject.wireframeColorValues;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lineColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.glColorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.glColorAttributeLocation);
    }
}