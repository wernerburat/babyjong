import {
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
  WebGPUEngine,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
  ArcRotateCamera,
  Mesh,
  SceneLoader,
} from "@babylonjs/core";
import { CustomLoadingScreen } from "./CustomLoadingScreen";
import { loadTextures } from "../game/TextureLoader";
import { MahjongTile } from "../game/MahjongTile";
import { GLTFFileLoader } from "@babylonjs/loaders";

export class NewScene {
  scene!: Scene;
  loadingScreen!: CustomLoadingScreen;
  camera!: ArcRotateCamera;
  cameraTarget!: Mesh;

  constructor(
    private engine: WebGPUEngine,
    private hk: HavokPlugin,
    private canvas: HTMLCanvasElement
  ) {
    this.initScene();
  }

  private initScene() {
    this.scene = this.createScene();
    this.CreateEnvironment();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  get sceneInstance() {
    return this.scene;
  }

  createScene(): Scene {
    const scene = new Scene(this.engine);
    scene.enablePhysics(new Vector3(0, -9.81, 0), this.hk);

    this.createRandomTile();
    this.CreateCamera();

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0.5;

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );
    const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {
      mass: 0,
      restitution: 0.1,
    });

    this.engine.hideLoadingUI();
    return scene;
  }

  async CreateTile(): Promise<void> {
    new GLTFFileLoader();
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "tile.glb"
    );
    console.log(meshes[1]);
    const tileMesh = meshes[0] as Mesh;
    const tile = new MahjongTile(this.scene, await loadTextures(), tileMesh);
  }

  async createRandomTile() {
    // const textures = await loadTextures();
    // const tile = new MahjongTile(this.scene, textures);
    // tile.getMesh().position.y = 0.2;
    // tile.getMesh().position.x = 0;
    // tile.setRandomTexture();
    // this.cameraTarget = tile.getMesh();
    this.CreateTile();
  }

  CreateCamera(): void {
    // https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction
    // https://doc.babylonjs.com/img/how_to/camalphabeta.jpg

    const pi = Math.PI;
    this.camera = new ArcRotateCamera(
      "camera",
      // Alpha    Rotation around Y axis    (left and right)  -pi/2 = in front of target   0 = behind target
      -pi / 2,
      // Beta     Rotation around X axis    (up and down)      pi/2 = in front of target   0 = above target
      pi / 5,
      // Radius   Distance from point of interest
      2,
      new Vector3(0, 0, 0),
      this.scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.wheelPrecision = 50;

    // Near-clip plane
    this.camera.minZ = 0.001;

    this.camera.useBouncingBehavior = true;
    this.camera.bouncingBehavior!.transitionDuration = 250;

    this.camera.useAutoRotationBehavior = false;
    //this.camera.autoRotationBehavior!.idleRotationSpeed = 0.3;
    //this.camera.autoRotationBehavior!.idleRotationWaitTime = 3000;
    //this.camera.autoRotationBehavior!.idleRotationSpinupTime = 250;
  }

  createABunchOfBalls(): void {
    const cols = 4;
    const height = 250;
    const totalBalls = (cols + 1) * height;

    for (let i = 0 - cols; i < cols + 1; i++) {
      for (let j = 1; j < height; j++) {
        this.spawnBall(i, j, 0);
      }
    }
  }

  spawnBall(x: number, y: number, z: number) {
    const ball = MeshBuilder.CreateSphere(
      "ball",
      { diameter: 0.5 },
      this.scene
    );
    const randomness = 0.1;
    ball.position = new Vector3(x, y, z);
    ball.position.x += Math.random() * randomness;
    ball.position.y += Math.random() * randomness;
    ball.position.z += Math.random() * randomness;
    const ballAggregate = new PhysicsAggregate(ball, PhysicsShapeType.SPHERE, {
      mass: 1,
      restitution: 0.1,
    });
  }

  async CreateEnvironment(): Promise<void> {
    // await SceneLoader.ImportMeshAsync(
    //   "",
    //   "./models/",
    //   "LightingScene.glb",
    //   this.scene,
    //   (evt) => {
    //     const loadStatus = ((evt.loaded * 100) / evt.total).toFixed();
    //     this.loadingScreen.updateLoadingUI(loadStatus);
    //   }
    // );
  }
}
