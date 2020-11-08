// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020


webglMain();
main();


function main()
{
    const cameraRadius = 600;
    const cameraDeltaRotation = new Vector3(0, 2, 0);
    const cameraPosition = new Vector3(0,-50,cameraRadius);
    const cameraRotation = new Vector3(30,15,0);

    document.addEventListener('keydown', onKeyDown);

    function onKeyDown(event)
    {
        if(event.keyCode == 75)
        {
            animateFrame();
        }
    }

    scene.camera.position = cameraPosition;
    scene.camera.rotation = cameraRotation;
    scene.camera.deltaRotation = cameraDeltaRotation;
    //console.log(scene.glObjects[0]);
    render();

    function animateFrame()
    {
        animateSpherePositions();
        scene.animate();
        render();
    }
}