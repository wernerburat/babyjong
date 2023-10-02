<template>
  <div class="container">
    <h3>Mes boules</h3>
    <canvas ref="bjsCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "@vue/runtime-core";
import { NewScene } from "../scenes/NewScene";
import { WebGPUEngine, HavokPlugin } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";

const bjsCanvas = ref(null);

onMounted(() => {
  const engine = new WebGPUEngine(bjsCanvas.value!);
  engine.initAsync().then(async () => {
    const havokInstance = await HavokPhysics();
    const hk = new HavokPlugin(true, havokInstance);
    new NewScene(engine, hk);
  });
});
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
}
</style>
