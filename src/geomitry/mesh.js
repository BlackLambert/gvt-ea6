// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Mesh
{
    constructor(vertices)
    {
        assert(vertices != undefined || 
            vertices.length >= 2 || 
            !vertices.includes(undefined) || 
            vertices[0].index != undefined,
            [vertices],
            "Wrong coloredVertices input");
        
        this.vertices = vertices;
    }

    getIndices(indexOffset)
    {
        let result = [];
        for(let i = 0; i < this.vertices.length; i++)
        {
            result.push(this.vertices[i].index + indexOffset);
        }
        return result;
    }
}

class Face extends Mesh
{
    constructor(vertices)
    {
        super(vertices);
    }
}

class Line extends Mesh
{
    constructor(vertices)
    {
        super(vertices);
    }
}