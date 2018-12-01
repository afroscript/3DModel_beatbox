var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var initCameraPositinZ = 250;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var orbitContlols;

var line;

// PCのマイクから音をひろってくる

var audioctx = new AudioContext();

var analyser = audioctx.createAnalyser();
analyser.fftSize = 128;
analyser.minDecibels = -100;
analyser.maxDecibels = -30;

var obj0;
var objs = [];
var num = 6;

var getUserMedia = navigator.getUserMedia ? 'getUserMedia' :
    navigator.webkitGetUserMedia ? 'webkitGetUserMedia' :
    navigator.mozGetUserMedia ? 'mozGetUserMedia' :
    navigator.msGetUserMedia ? 'msGetUserMedia' :
    undefined; 
var astream, micsrc;
var conditions={audio:true, video:false};

const Mic = () => {
    navigator[getUserMedia](
        conditions,
        (stream) => {
            astream=stream;
            micsrc=audioctx.createMediaStreamSource(stream);
            micsrc.connect(audioctx.destination);
            micsrc.connect(analyser);
        },
        (e) => { console.error(e); }
    );
}

Mic(); //Mic集音開始

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

    scene.remove(line)

    var data = new Uint8Array(512);

    analyser.getByteFrequencyData(data); //Spectrum Dataの取得
    // analyser.getByteTimeDomainData(data); //Waveform Dataの取得

    var lineGeometry = new THREE.Geometry();
    for(var i = 0; i < 32; ++i) {
        lineGeometry.vertices.push(
            new THREE.Vector3( i * 10, data[i] * 0.7, 0 )
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

    // createLine
    createLine();

    camera.lookAt( scene.position );

    renderer.render( scene, camera );

}
