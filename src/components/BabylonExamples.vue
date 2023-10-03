<template>
  <div class="container">
    <h3>Mon jogne</h3>
    <div ref="loader" id="loader">
      <p>sa charges...</p>
      <div id="loadingContainer">
        <div ref="loadingBar" id="loadingBar"></div>
      </div>
      <p ref="percentLoaded" id="percentLoaded">25%</p>
    </div>
    <canvas ref="bjsCanvas"></canvas>
    <button @click="debug">debug</button>
    <button @click="move">move</button>
    <button @click="createTiles">createTiles</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { NewScene } from "../scenes/NewScene";
import { WebGPUEngine, HavokPlugin } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { CustomLoadingScreen } from "../scenes/CustomLoadingScreen";
import { MySceneDirector } from "../director/MySceneDirector";

const sceneDirector = new MySceneDirector();

const bjsCanvas = ref<HTMLCanvasElement | null>(null);
const loader = ref<HTMLElement>();
const loadingBar = ref<HTMLElement>();
const percentLoaded = ref<HTMLElement>();

onMounted(() => {
  const engine = new WebGPUEngine(bjsCanvas.value!);
  const loadingScreen = new CustomLoadingScreen(
    loadingBar.value!,
    percentLoaded.value!,
    loader.value!
  );
  engine.loadingScreen = loadingScreen;
  engine.displayLoadingUI();

  engine.initAsync().then(async () => {
    const havokInstance = await HavokPhysics();
    const hk = new HavokPlugin(true, havokInstance);
    new NewScene(sceneDirector.bus, engine, hk, bjsCanvas.value!);
  });
});

const createTiles = async () => {
  void sceneDirector.createTiles(3);
};

const debug = () => {
  // const tiles = scene.value.Tiles;
  // let xPos = -1.5;
  // let zPos = 1.3;
  // let index = 0;
  // tiles.forEach((tile: MahjongTile) => {
  //   if (index % 14 == 0) {
  //     xPos = -1.5;
  //     zPos -= 0.3;
  //   }
  //   xPos += 0.2;
  //   tile.getMesh().position.x = xPos;
  //   tile.getMesh().position.z = zPos;
  //   index++;
  // });
  // console.log(scene.value.Tiles);
};

async function move() {
  // const tiles = scene.value.Tiles;
  // let xPos = -1.5;
  // let zPos = 1.3;
  // let index = 0;
  // tiles.forEach(async (tile: MahjongTile) => {
  //   if (index % 14 == 0) {
  //     xPos = -1.5;
  //     zPos -= 0.3;
  //   }
  //   xPos += 0.2;
  //   const newPos = new Vector3(xPos, 0, zPos);
  //   await scene.value.positionTile(tile, newPos, 0.5);
  //   index++;
  // });
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
canvas {
  width: 70%;
  height: 70%;
  border: 1px solid black;
  border-radius: 10px;
}

#loader {
  width: 100%;
  height: 100%;
  background: slategray;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#loaded {
  width: 100%;
  height: 100%;
  background: slategray;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 1s ease;
}
#loadingContainer {
  width: 50%;
  height: 20px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#loadingBar {
  width: 0%;
  height: 100%;
  background: green;
  border-radius: 10px;
  transition: width 1s ease;
}
</style>
