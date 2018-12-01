var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var initCameraPositinZ = 250;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var orbitContlols;

var line;

init();
animate();



function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = initCameraPositinZ;

    // scene

    scene = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    // model

    var onProgress = function ( xhr ) {
  
        if ( xhr.lengthComputable ) {

            var percentComplete = xhr.loaded / xhr.total * 100; 
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    };

    var onError = function () { };

    // renderer
 
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    // Controls

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener( 'resize', onWindowResize, false );

    // createLine
    createLine();

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

}

function createLine() {

    var lineGeometry = new THREE.Geometry();
    for(var i = 0; i < 32; ++i) {
        lineGeometry.vertices.push(
            new THREE.Vector3( i * 10, Math.random() * 10, 0 )
        ); 
    }

    //線オブジェクトの生成	
    line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color: 0xffffff} ) );

    //sceneにlineを追加
    scene.add( line );

}



//

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {

    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}
