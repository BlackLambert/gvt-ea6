class Camera
{

    constructor(position, rotation, fieldOfView, minFieldOfView, maxFieldOfView, near, far)
    {
        assert(position.elements.length === 3 &&
            rotation.elements.length === 3,
            [position, rotation],
            "Invalid arguments")

        this.position = position;
        this.setRotation(rotation);
        this.fieldOfView = fieldOfView;
        this.minFieldOfView = minFieldOfView;
        this.maxFieldOfView = maxFieldOfView;
        this.near = near;
        this.far = far;

        this.deltaPosition = Vector3.zero();
        this.deltaRotation = Vector3.zero();
        this.deltaScale = Vector3.zero();
    }

    
    setFieldOfView(value)
    {
        this.fieldOfView = clamp(value, this.minFieldOfView, this.maxFieldOfView);
    }

    static createOrthographic()
    {
        return new Camera(Vector3.zero(), Vector3.zero(), 60, 10, 175, 400, -400);
    }

    static createPerspective()
    {
        return new Camera(Vector3.zero(), Vector3.zero(), 60, 10, 175, 1, 2000);
    }

    get viewMatrix()
    {
        let matrix = Matrix.createUnitMatrix(4);
        //console.log(matrix);
        matrix = matrix.multiply(Matrix.createTranslationMatrix(this.position));
        //console.log(matrix);
        matrix = matrix.multiply(Matrix.createRotationMatrixXYZ(this.rotation));
        //console.log(matrix);
        matrix = matrix.inverse();
        //console.log(matrix);
        return matrix;
    }

    rotateAroundCenter(rotation, distance)
    {
        assert(typeof rotation.x === "number" && typeof distance === "number", 
            [rotation, distance], 
            "Invalid distance or angle")

        
        /*this.rotation = [0, angle, 0];
        let matrix = Matrix.createUnitMatrix(4);
        //matrix = matrix.multiply(Matrix.createTranslationMatrix([0,0,distance]));
        matrix = matrix.multiply(Matrix.createRotationMatrix(angle, 1, 4));
        let newPos = matrix.multiply(new Matrix([0, 0, distance, 0], 1, 4)).elements;
        console.log(newPos);
        this.position = [newPos[0],newPos[1],newPos[2]];*/

        this.rotation = rotation;
        this.position = new Vector3(0, 0, distance);
    }

    setRotation(rotation)
    {
        this.rotation = new Vector3(rotation.x%360, rotation.y%360, rotation.z%360);
    }

    animate()
    {
        this.position = this.position.add(this.deltaPosition);
        this.setRotation(this.rotation.add(this.deltaRotation));
    }
}