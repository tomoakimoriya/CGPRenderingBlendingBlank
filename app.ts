///<reference path="./node_modules/@types/three/index.d.ts"/>

class ThreeJSTest {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private geometry: THREE.Geometry;
    private material: THREE.MeshBasicMaterial;
    private texture: THREE.Texture;
    private light: THREE.Light;
    private screenWidth: number = 640;
    private screenHeight: number = 480;
    private rotAngle: number = 0;
    private rotRadius: number = 3;

    private line: THREE.LineSegments;
    private linegeometries: THREE.Geometry[];
    private linematerials: THREE.LineBasicMaterial[];

    private flares: THREE.Object3D[];

    constructor() {
        this.createRenderer();
        this.createScene();
    }

    private createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
        this.renderer.setClearColor(new THREE.Color(0x000000));
        document.getElementById("viewport").appendChild(this.renderer.domElement);
    }

    private addFlares(pos: THREE.Vector3)
    {

    }

    private updateFlares()
    {

    }

    private createScene() {
        this.scene = new THREE.Scene();

        this.flares = new Array();

        var textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load("glow.png");

        this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
        this.geometry = new THREE.PlaneGeometry(3, 3);

        this.camera = new THREE.PerspectiveCamera(75, this.screenWidth /
            this.screenHeight, 0.1, 1000);
        this.camera.position.x = 3;
        this.camera.position.y = 3;
        this.camera.position.z = 3;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.light = new THREE.DirectionalLight(0xffffff);
        var lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        this.linegeometries = new Array(3);
        this.linegeometries[0] = new THREE.Geometry();
        this.linegeometries[1] = new THREE.Geometry();
        this.linegeometries[2] = new THREE.Geometry();
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
        this.linematerials = new Array(3);
        this.linematerials[0] = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.linematerials[1] = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        this.linematerials[2] = new THREE.LineBasicMaterial({ color: 0x0000ff });
        for (var i = 0; i < 3; i++) {
            var line = new THREE.LineSegments(this.linegeometries[i], this.linematerials[i]);
            this.scene.add(line);
        }
    }

    public render() {
        this.rotAngle += 0.01;
        this.addFlares(new THREE.Vector3(Math.cos(this.rotAngle) * this.rotRadius, 0, Math.sin(this.rotAngle) * this.rotRadius));
        this.updateFlares();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }

}

document.addEventListener("DOMContentLoaded", function () {
    var threeJSTest = new ThreeJSTest();
    threeJSTest.render();
});