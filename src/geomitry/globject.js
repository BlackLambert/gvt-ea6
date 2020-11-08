// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class GLObject
{
    constructor(localPosition, localRotation, localScale, vertices, faces, wireframe)
    {
        assert(localPosition.elements.length === 3 &&
            localRotation.elements.length === 3 &&
            localScale.elements.length === 3,
            [localPosition, localRotation, localScale, vertices, faces, wireframe],
            "Invalid arguments")

        this.localPosition = localPosition;
        this.setLocalRotation(localRotation);
        this.localScale = localScale;
        this.vertices = vertices;
        this.faces = faces;
        this.wireframe = wireframe;
        this.setFaceColor(Color.black())
        this.setWireframeColor(Color.black())

        this.deltaPosition = Vector3.zero();
        this.deltaRotation = Vector3.zero();
        this.deltaScale = Vector3.zero();
    }

    get verticePositions()
    {
        let result = [];
        for(let i = 0; i < this.vertices.length; i++)
        {
            let vP = this.vertices[i].localPosition;
            result.push(vP.x);
            result.push(vP.y);
            result.push(vP.z);
        }
        //console.log(result);
        return result;
    }

    get translationMatrix()
    {
        return Matrix.createTranslationMatrix(this.localPosition);
    }

    get rotationMatrixX()
    {
        return Matrix.createRotationMatrix(this.localRotation.x, 0, 4);
    }

    get rotationMatrixY()
    {
        return Matrix.createRotationMatrix(this.localRotation.y, 1, 4);
    }

    get rotationMatrixZ()
    {
        return Matrix.createRotationMatrix(this.localRotation.z, 2, 4);
    }

    get rotationMatrix()
    {
        return Matrix.createRotationMatrixXYZ(this.localRotation);
    }

    get scaleMatrix()
    {
        return Matrix.createScaleMatrix(this.localScale.elements);
    }

    transformationMatrix()
    {
        let result = Matrix.createUnitMatrix(4);
        result = result.multiply(this.scaleMatrix);
        result = result.multiply(this.rotationMatrix);
        result = result.multiply(this.translationMatrix);
        
        //console.log(zToWMatrix);
        //console.table([zToWMatrix.elements, projectionMatrix.elements, this.translationMatrix.elements, this.rotationMatrix.elements, this.scaleMatrix.elements, result.elements]);
        //console.log(result.multiply(new Matrix([50,50,50,1], 1, 4)));
        return result;
    }

    faceIndices(indexOffset)
    {
        return this.faces.reduce((r, f) => r = r.concat(f.getIndices(indexOffset)),[]);
    }

    wireframeIndices(indexOffset)
    {
        return this.wireframe.reduce((r, l) => r = r.concat(l.getIndices(indexOffset)),[]);
    }

    get faceColorValues()
    {
        return this.faceColors.reduce((r, c) => r = r.concat(c.toArray()),[]);
    }

    get wireframeColorValues()
    {
        return this.wireframeColors.reduce((r, c) => r = r.concat(c.toArray()), []);
    }

    setFaceColor(color)
    {
        this.faceColors = this.createColorsArrayOf(color);
    }

    setSingleFaceColor(index, color)
    {
        this.faceColors[index] = color;
    }

    setWireframeColor(color)
    {
        this.wireframeColors = this.createColorsArrayOf(color);
    }

    setSingleWireframeColor(index, color)
    {
        this.wireframeColors[index] = color;
    }

    createColorsArrayOf(color)
    {
        let colors = [];
        for(let i = 0; i < this.vertices.length; i++)
        {
            colors.push(color);
        }
        return colors;
    }

    setLocalRotation(rotation)
    {
        this.localRotation = new Vector3(rotation.x%360, rotation.y%360, rotation.z%360);
    }

    removeDoubleLines()
    {
        let lines = [];
        let iDs = [];
        this.wireframe.forEach(line => {
            let iD = [line.vertices[0].index, line.vertices[1].index];
            let reverseID = [line.vertices[1].index, line.vertices[0].index];
            let containsIDs = iDs.some(o => o[0] === iD[0] && o[1] === iD[1] || o[0] === reverseID[0] && o[1] === reverseID[1]);
            if(!containsIDs)
            {
                lines.push(line);
                iDs.push(iD);
                iDs.push(reverseID);
            }
        });
        this.wireframe = lines;
        //console.log(this.wireframe.length);
    }

    animate()
    {
        this.localPosition = this.localPosition.add(this.deltaPosition);
        this.setLocalRotation(this.localRotation.add(this.deltaRotation));
        this.localScale = this.localScale.add(this.deltaScale);
    }
}