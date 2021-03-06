import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import * as Stats from "stats.js";
import * as TWEEN from "@tweenjs/tween.js";
import * as Physijs from "physijs-webpack";


class ThreeJSContainer {
    private scene: THREE.Scene;
    private geometry: THREE.Geometry;
    private material: THREE.Material;
    private light: THREE.Light;

    private camera: THREE.Camera;
    private texture: THREE.Texture;
    private rotAngle: number = 0;
    private rotRadius: number = 3;

    private line: THREE.LineSegments;
    private linegeometries: THREE.Geometry[];
    private linematerials: THREE.LineBasicMaterial[];

    private flares: THREE.Object3D[];

    constructor() {
        this.scene = new THREE.Scene();
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
        this.flares = [];
        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load("glow.png");

        this.geometry = new THREE.PlaneGeometry(3, 3);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });

        this.light = new THREE.DirectionalLight(0xffffff);
        var lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        this.linegeometries = [
            new THREE.Geometry(),
            new THREE.Geometry(),
            new THREE.Geometry()
        ];
        this.linegeometries[0].vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 0, 0)
        );
        this.linegeometries[1].vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 3, 0)
        );
        this.linegeometries[2].vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 3)
        );
        this.linematerials = [
            new THREE.LineBasicMaterial({ color: 0xff0000 }),
            new THREE.LineBasicMaterial({ color: 0x00ff00 }),
            new THREE.LineBasicMaterial({ color: 0x0000ff })
        ];
        for (let i = 0; i < 3; i++) {
            const line = new THREE.LineSegments(this.linegeometries[i], this.linematerials[i]);
            this.scene.add(line);
        }


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

const container = new ThreeJSContainer();

const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(3, 3, 3));
document.body.appendChild(viewport);
container.createScene();
