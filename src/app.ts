import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import * as Stats from "stats.js";
import * as Physijs from "physijs-webpack";


class ThreeJSContainer {
    private scene: THREE.Scene;
    private geometry: THREE.BufferGeometry;
    private material: THREE.Material;
    private light: THREE.Light;

    private camera: THREE.Camera;
    private texture: THREE.Texture;
    private rotAngle: number = 0;
    private rotRadius: number = 3;

    private flares: THREE.Object3D[];

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(this.camera, renderer.domElement);

        this.createScene();

        // 毎フレームのupdateを呼んで，render
        // reqest... により次フレームを呼ぶ
        const render = () => {
            orbitControls.update();

            renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        }
        render();

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    public createScene = () => {
        this.scene = new THREE.Scene();

        this.flares = [];
        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load("glow.png");

        this.geometry = new THREE.PlaneGeometry(3, 3);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });

        this.light = new THREE.DirectionalLight(0xffffff);
        var lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        const xaxisvs = new Float32Array([
            0, 0, 0,
            3, 0, 0
        ]);
        const yaxisvs = new Float32Array([
            0, 0, 0,
            0, 3, 0
        ]);
        const zaxisvs = new Float32Array([
            0, 0, 0,
            0, 0, 3
        ]);
        const xageom = new THREE.BufferGeometry();
        xageom.setAttribute( 'position', new THREE.BufferAttribute( xaxisvs, 3 ) );
        const yageom = new THREE.BufferGeometry();
        yageom.setAttribute( 'position', new THREE.BufferAttribute( yaxisvs, 3 ) );
        const zageom = new THREE.BufferGeometry();
        zageom.setAttribute( 'position', new THREE.BufferAttribute( zaxisvs, 3 ) );
        this.scene.add(new THREE.LineSegments(xageom, new THREE.LineBasicMaterial({ color: 0xff0000 })));
        this.scene.add(new THREE.LineSegments(yageom, new THREE.LineBasicMaterial({ color: 0x00ff00 })));
        this.scene.add(new THREE.LineSegments(zageom, new THREE.LineBasicMaterial({ color: 0x0000ff })));

        const addFlares = (pos: THREE.Vector3) => {

        }

        const updateFlares = () => {

        }

        // 毎フレームのupdateを呼んで，更新
        // reqest... により次フレームを呼ぶ
        const update = () => {
            this.rotAngle += 0.01;
            addFlares(new THREE.Vector3(Math.cos(this.rotAngle) * this.rotRadius, 0, Math.sin(this.rotAngle) * this.rotRadius));
            updateFlares();


            requestAnimationFrame(update);
        }
        update();
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-3, 3, 3));
    document.body.appendChild(viewport);
}
