// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Torus extends GLObject
{
    constructor(localPosition, localRotation, localScale, vertices, faces, wireframe)
    {
        super(localPosition, localRotation, localScale, vertices, faces, wireframe);
    }

    static createBasic(innerRadius, outerRadius, resolution, localPosition, lineColor, faceColor)
    {
        const torusMinU = 0;
        const torusMaxU = 2 * Math.PI;
        const torusMinV = 0;
        const torusMaxV = 2 * Math.PI;
        const torusDeltaU = (torusMaxU - torusMinU) / resolution;
        const torusDeltaV= (torusMaxV - torusMinV) / resolution;
        const meshVerticesCount = resolution * resolution;

        const r = (outerRadius - innerRadius)/2;
        const R = innerRadius + r;
        const p = localPosition;
        let vertices = [];
        let triangulation = Triangulation.createEmpty();

        for(let i = 0; i<=resolution; i++)
        {
            for(let j = 0; j<=resolution; j++)
            {
                let index = j+i*resolution;

                if(i<resolution && j<resolution)
                {
                    let u = torusMinU + j*torusDeltaU;
                    let v = torusMinV + i*torusDeltaV;

                    let x = (R + r * Math.cos(u)) * Math.cos(v);
                    let y = (R + r * Math.cos(u)) * Math.sin(v);
                    let z = r * Math.sin(u);
                    
                    vertices.push(new Vertex(new Vector3(x,y,z), index));
                }

                if(i > 0 && j > 0)
                {
                    let i1 = index - 1 - resolution;
                    let i2 = (index - 1) % meshVerticesCount;
                    let i3 = ((j % resolution) + i * resolution) % meshVerticesCount;
                    let i4 = (j % resolution) + i * resolution - resolution;
                    triangulation.combine(Triangulation.triangulateFour([vertices[i1], vertices[i4], vertices[i3], vertices[i2]]));
                }
            }
        }

        let result = new Torus(p, Vector3.zero(), Vector3.one(), vertices, triangulation.faces, triangulation.lines);
        result.removeDoubleLines();
        result.setFaceColor(faceColor);
        result.setWireframeColor(lineColor);
        return result;
    }
}