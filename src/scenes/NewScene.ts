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
} from "@babylonjs/core";
import { CustomLoadingScreen } from "./CustomLoadingScreen";
import { loadTextures } from "../game/TextureLoader";
import { MahjongTile } from "../game/MahjongTile";

export class NewScene {
  scene!: Scene;
  loadingScreen!: CustomLoadingScreen;
  camera!: ArcRotateCamera;

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
  }

  get sceneInstance() {
    return this.scene;
  }

  createScene(): Scene {
    const scene = new Scene(this.engine);
    scene.enablePhysics(new Vector3(0, -9.81, 0), this.hk);
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

    this.createRandomTile();

    this.engine.hideLoadingUI();
    return scene;
  }

  async createRandomTile() {
    const textures = await loadTextures();
    console.log(textures);
    const tile = new MahjongTile(this.scene, textures);

    tile.setRandomTexture();
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

  CreateCamera(): void {
    this.camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2, // Alpha - Clockwise
      Math.PI / 2, // Beta - Counter Clockwise
      5,
      new Vector3(0, 0, 0),
      this.scene
    );
    this.camera.attachControl(this.canvas, true);
    this.camera.setPosition(new Vector3(0, 5, -10));
    this.camera.wheelPrecision = 25;

    this.camera.minZ = 0.3;
    this.camera.upperRadiusLimit = 20;
    this.camera.lowerRadiusLimit = 2;

    this.camera.fov = 0.8;

    this.camera.useBouncingBehavior = true;
    this.camera.bouncingBehavior!.transitionDuration = 250;

    this.camera.useAutoRotationBehavior = true;
    this.camera.autoRotationBehavior!.idleRotationSpeed = 0.3;
    this.camera.autoRotationBehavior!.idleRotationWaitTime = 3000;
    this.camera.autoRotationBehavior!.idleRotationSpinupTime = 250;
  }
}
