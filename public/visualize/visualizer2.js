var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, $(window).width() / $(window).height(), 1, 1000);
var renderer = new THREE.WebGLRenderer();
var cubes = new Array();
var controls;
var flickrImage = $('').val();
document.getElementById('canvas-container').appendChild(renderer.domElement);

var i = 0;
for(var x = 0; x < 10; x += 2) {
	var j = 0;
	cubes[i] = new Array();
	for(var y = 0; y < 10; y += 2) {
		var geometry = new THREE.CubeGeometry(1.5, 1.5, 1.5);

		// var material = new THREE.MeshPhongMaterial({
		// 	color: randomFairColor(),
		// 	ambient: 0x808080,
		// 	specular: 0xffffff,
		// 	shininess: 20,
		// 	reflectivity: 5.5
		// });

		flickrImage = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
				map: THREE.ImageUtils.loadTexture('data/Marshmello2.jpg')
		});
		flickrImage.map.needsUpdate = true; //ADDED

		cubes[i][j] = new THREE.Mesh(geometry, flickrImage);
		cubes[i][j].position = new THREE.Vector3(x, y, 0);

		scene.add(cubes[i][j]);
		j++;
	}
	i++;
}

var light = new THREE.AmbientLight(0x505050);
scene.add(light);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 0.2, 0.2);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0.2, 0.2, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, -0.2, -0.2);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-0.2, -0.2, 0);
scene.add(directionalLight);

camera.position.z = 10;

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render);

for(var i = 0; i < 0.20; i++) {
	// controls.pan(new THREE.Vector3( (i/0.20), 0, 0 ));
	controls.pan(new THREE.Vector3( 0, 0.2, 0.2 ));
}

var render = function () {

	if(typeof array === 'object' && array.length > 0) {
		var k = 0;
		for(var i = 0; i < cubes.length; i++) {
			for(var j = 0; j < cubes[i].length; j++) {
				var scale = (array[k] / boost) / 3;
				cubes[i][j].scale.z = (scale < 0.2 ? 0.2 : scale);
				k += (k < array.length ? 0.2 : 0);
			}
		}
	}

	requestAnimationFrame(render);
	controls.update();
	renderer.render(scene, camera);
};

render();
renderer.setSize($(window).width(), $(window).height());

function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}
