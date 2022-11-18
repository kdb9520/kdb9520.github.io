import *  as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export function starWars() {
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target = new THREE.Vector3(0, 0, -40);
    controls.update();

    // RESIZE HAMDLER
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // Stars

    function addStar() {
        const geometry = new THREE.SphereGeometry(0.25, 24, 24);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const star = new THREE.Mesh(geometry, material);

        const [x, y, z] = Array(3)
            .fill()
            .map(() => THREE.MathUtils.randFloatSpread(200));

        star.position.set(x, y, z);
        scene.add(star);
    }

    Array(400).fill().forEach(addStar);

    // Moon

    const moonTexture = new THREE.TextureLoader().load('moon.jpg');
    const normalTexture = new THREE.TextureLoader().load('normal.jpg');

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({
            map: moonTexture,
            normalMap: normalTexture
        })
    );

    scene.add(moon);

    moon.position.z = -60;
    moon.position.y = 7;
    moon.position.setX(-33);

    // INIT HEMISPHERE LIGHT
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    // SCENE
    scene.background = new THREE.Color(0x000000);

    // TEXT
    let starWarsText;

    let loader = new FontLoader().load('fonts/optimer_bold.typeface.json', function (font) {

        // const lorem = 'three.js\n3D Text Example\nYou can do cool stuff\nwith three.js fonts\n{ - } - $ - *\n% - # - +\n....\n...\n..\n.'

        const intro = "SCROLL DOWN"

        const geometry = new TextGeometry(intro, {
            font: font,
            size: 4,
            height: 1,
            curveSegments: 10,
            bevelEnabled: false,
            bevelOffset: 0,
            bevelSegments: 1,
            bevelSize: 0.3,
            bevelThickness: 1
        });
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xffff00 }), // front
            new THREE.MeshPhongMaterial({ color: 0xe1ad01 }) // side
        ];
        starWarsText = new THREE.Mesh(geometry, materials);
        starWarsText.castShadow = true
        starWarsText.position.z = -50
        starWarsText.position.y = -5
        starWarsText.position.x = -20
        starWarsText.rotation.x = - Math.PI / 4
        scene.add(starWarsText)
    });

    function moveCamera() {
        const t = document.body.getBoundingClientRect().top;
        moon.rotation.x += 0.05;
        moon.rotation.y += 0.075;
        moon.rotation.z += 0.05;

        camera.position.z -= t * -0.01;
        camera.position.x -= t * -0.0002;
        camera.rotation.y = t * -0.0002;
    }

    document.body.onscroll = moveCamera;
    moveCamera();

    // ANIMATE
    function animate() {
        // if (starWarsText) {
        // starWarsText.position.y += 0.05;
        // starWarsText.position.z -= 0.05;
        // }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    document.body.appendChild(renderer.domElement);
    animate();
}