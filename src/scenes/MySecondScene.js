import {
  ActionManager,
  ExecuteCodeAction,
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  HemisphericLight,
  WebGPUEngine,
  HavokPlugin,
  PhysicsAggregate,
  PhysicsShapeType,
} from "@babylonjs/core";

import HavokPhysics from "@babylonjs/havok";
let engine;

const createScene = async (canvas) => {
  engine = new WebGPUEngine(canvas);
  await engine.initAsync();
  const scene = new Scene(engine);

  const camera = new FreeCamera("camera1", new Vector3(0, 15, -20), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Physics
  const havokInstance = await HavokPhysics();
  const hk = new HavokPlugin(true, havokInstance);
  scene.enablePhysics(new Vector3(0, -9.81, 0), hk);

  const material = new StandardMaterial("material", scene);
  material.diffuseColor = new Color3(1, 0, 0);

  // Draw a square of 100 spheres w/ aggregators
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 100; k++) {
        const sphere = MeshBuilder.CreateSphere(
          "sphere",
          { diameter: 0.7, segments: 4 },
          scene
        );

        const material = new StandardMaterial("material", scene);
        material.diffuseColor = new Color3(1, 0, 0);
        sphere.material = material;

        // Add some randomness to the spheres
        sphere.position.z += Math.random() * 2 - 1;
        sphere.position.x += Math.random() * 2 - 1;

        sphere.position.y += 4 + k * 2;
        sphere.position.x += i * 2 - 3;
        sphere.position.z += j * 2 - 3;

        const sphereAggregate = new PhysicsAggregate(
          sphere,
          PhysicsShapeType.SPHERE,
          { mass: 1, restitution: 0.1 },
          scene
        );
      }
    }
  }

  // Stop the spheres from rendering once they are out of view
  scene.onBeforeRenderObservable.add(() => {
    scene.meshes.forEach((mesh) => {
      if (mesh.position.y < -100) {
        mesh.isVisible = false;
      } else {
        mesh.isVisible = true;
      }
    });
  });

  // Our built-in 'ground' shape.
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 10, height: 10 },
    scene
  );

  // Create a static box shape.
  const groundAggregate = new PhysicsAggregate(
    ground,
    PhysicsShapeType.BOX,
    { mass: 0 },
    scene
  );

  engine.runRenderLoop(() => {
    scene.render();
  });
};

const getFps = () => {
  return engine.getFps().toFixed();
};

export { createScene, getFps };
