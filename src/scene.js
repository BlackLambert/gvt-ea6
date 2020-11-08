// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Scene
{
    constructor(clearColor, glObjects, camera)
    {
        this.clearColor = clearColor;
        this.glObjects = glObjects;
        this.camera = camera;
    }

    animate()
    {
        this.glObjects.forEach(obj => {
            obj.animate();
        });
        this.camera.animate();
    }
}