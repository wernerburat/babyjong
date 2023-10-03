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
  CubeTexture,
  PBRMaterial,
  Texture,
  Animation,
} from "@babylonjs/core";
import { AsyncBus } from "../bus/AsyncBus";
import { IMessageBus } from "../bus/BusFactory";
import {
  SceneDirectorEventBusMessages,
  SceneEventBusMessages,
} from "../bus/events";
import { SceneDirectorCommand } from "../director/BaseSceneDirector";
import { reviver } from "../utils/json";
import { CustomLoadingScreen } from "./CustomLoadingScreen";
import { MahjongTile } from "../game/MahjongTile";

export class NewScene {
  scene!: Scene;
  loadingScreen!: CustomLoadingScreen;
  camera!: ArcRotateCamera;
  cameraTarget!: Mesh;
  tiles!: MahjongTile[];

  constructor(
    private _eventBus: IMessageBus,
    private engine: WebGPUEngine,
    private hk: HavokPlugin,
    private canvas: HTMLCanvasElement
  ) {
    this.initScene();
  }

  public registerBusEvents() {
    const messagesToActions = this.getMessagesToActionsMapping();

    this._eventBus.$on(
      SceneDirectorEventBusMessages.SceneDirectorCommand,
      (sceneDirectorCommandJson: string) => {
        const sceneDirectorCommand = <SceneDirectorCommand>(
          JSON.parse(sceneDirectorCommandJson, reviver)
        );
        const action = messagesToActions.get(sceneDirectorCommand.messageType);
        console.log(
          "BabylonJS Scene has received command",
          sceneDirectorCommand
        );
        if (action) {
          action.call(this, sceneDirectorCommand);
        }
      }
    );
  }

  public unregisterBusEvents() {
    this._eventBus.$off(SceneDirectorEventBusMessages.SceneDirectorCommand);
  }

  getMessagesToActionsMapping() {
    const messagesToActions = new Map<string, (payload: any) => void>();
    messagesToActions.set(
      SceneDirectorEventBusMessages.CreateTiles,
      this.CreateTiles
    );
    return messagesToActions;
  }

  private initScene() {
    this.scene = this.createScene();

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

  get Tiles() {
    return this.tiles;
  }

  createScene(): Scene {
    const scene = new Scene(this.engine);
    scene.enablePhysics(new Vector3(0, -9.81, 0), this.hk);

    this.CreateGround();
    this.CreateCamera();
    //this.CreateTiles();

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      scene
    );

    hemiLight.intensity = 0.0;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./environment/sky.env",
      scene
    );

    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true, 1000, 0.1);

    this.engine.hideLoadingUI();
    return scene;
  }

  CreateTiles(sceneDirectorCommand: SceneDirectorCommand): void {
    console.log("aaa");
    const amount = <number>sceneDirectorCommand.payload;

    const tiles = [];
    for (let i = 0; i < amount; i++) {
      const tile = new MahjongTile(this.scene);
      tiles.push(tile);
    }
    this.tiles = tiles;
    this.commandFinished(sceneDirectorCommand, tiles);
  }

  public async positionTile(
    tile: MahjongTile,
    to: Vector3,
    speed: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!tile) {
        reject("Tile no existeru");
      }

      const from = tile.meshes[0].position;
      const positionAnimation = new Animation(
        "posAnim",
        "position",
        60,
        Animation.ANIMATIONTYPE_VECTOR3
      );
      const keys = [];

      const frames = 60;
      keys.push({
        frame: 0,
        value: from,
      });

      keys.push({
        frame: frames,
        value: to,
      });

      positionAnimation.setKeys(keys);
      this.scene.beginAnimation(tile.meshes[0], 0, frames, false, speed, () => {
        resolve();
      });
    });
  }

  CreateCamera(): void {
    // https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction
    // https://doc.babylonjs.com/img/how_to/camalphabeta.jpg

    const pi = Math.PI;
    this.camera = new ArcRotateCamera(
      "camera",
      // Alpha    Rotation around Y axis    (left and right)  -pi/2 = in front of target   0 = behind target
      -pi / 3,
      // Beta     Rotation around X axis    (up and down)      pi/2 = in front of target   0 = above target
      pi / 5,
      // Radius   Distance from point of interest
      1,
      new Vector3(-0.1, 0, 0.1),
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

  CreateGround(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 3, height: 3 },
      this.scene
    );
    const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, {
      mass: 0,
      restitution: 0.1,
    });

    const groundMaterial = new PBRMaterial("groundMaterial", this.scene);

    groundMaterial.albedoTexture = new Texture(
      "./textures/fabric_pattern_05_col_01_1k.jpg",
      this.scene
    );

    groundMaterial.bumpTexture = new Texture(
      "./textures/fabric_pattern_05_nor_gl_1k.jpg",
      this.scene
    );

    groundMaterial.useAmbientOcclusionFromMetallicTextureRed = true;
    groundMaterial.useRoughnessFromMetallicTextureGreen = true;
    groundMaterial.useMetallnessFromMetallicTextureBlue = true;

    groundMaterial.metallicTexture = new Texture(
      "./textures/fabric_pattern_05_arm_1k.jpg",
      this.scene
    );

    groundMaterial.roughness = 0.4;
    groundMaterial.metallic = 0;

    ground.material = groundMaterial;
  }

  // helper methods
  emitCommand(name: SceneEventBusMessages, payload?: any) {
    console.log("BabylonJS Scene is sending command", name, payload);
  }

  commandFinished(sceneDirectorCommand: SceneDirectorCommand, payload?: any) {
    console.log(
      "BabylonJS Scene has finished command",
      sceneDirectorCommand.id,
      payload
    );
    AsyncBus.commandFinished(this._eventBus, sceneDirectorCommand, payload);
  }
}
