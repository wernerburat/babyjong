import {
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
  WebGPUEngine,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

export class NewScene {
  scene!: Scene;

  constructor(private engine: WebGPUEngine, private hk: HavokPlugin) {
    this.initScene();
  }

  private initScene() {
    this.scene = this.createScene();

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
    const camera = new FreeCamera("camera", new Vector3(0, 4, -10), this.scene);
    camera.rotation = new Vector3(0.2, 0, 0);
    camera.attachControl();

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

    const cols = 4;
    const height = 250;
    for (let i = 0 - cols; i < cols + 1; i++) {
      for (let j = 1; j < height; j++) {
        this.spawnBall(i, j, 0);
      }
    }

    return scene;
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
}
