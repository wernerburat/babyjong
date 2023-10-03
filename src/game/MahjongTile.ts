import {
  Scene,
  Mesh,
  Vector3,
  PBRMaterial,
  Texture,
  SceneLoader,
  GlowLayer,
  MeshUVSpaceRenderer,
  DecalMapConfiguration,
  Color3,
} from "@babylonjs/core";
import { GLTFFileLoader } from "@babylonjs/loaders";

export class MahjongTile {
  private tile!: Mesh;
  private scene: Scene;
  public meshes: Mesh[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
    this.CreateTile();
  }

  async CreateTile(): Promise<void> {
    new GLTFFileLoader();
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "tile.glb"
    );

    const tileMesh = meshes[0] as Mesh;
    const tileFace = meshes[2] as Mesh;
    const tileFaceBackground = tileFace.clone("tileFaceBackground");

    this.meshes.push(tileMesh); // Tile borders / Exterior (Root)
    this.meshes.push(tileFace); // Tile face (front)
    this.meshes.push(meshes[2] as Mesh); // Rest
    this.meshes.push(tileFaceBackground as Mesh); // Cloned Tile Face for BG
    const material = new PBRMaterial("tileMaterial", this.scene);

    // Set the texture path
    const texture = new Texture(
      getRandomTexturePath(),
      this.scene,
      false,
      false // No invert Y
    );

    // Tile face texture
    texture.wAng = Math.PI / 2;
    texture.invertY;
    texture.uScale = 4.8; // Left-Right
    texture.vScale = 4.35; // Up-Down
    texture.uOffset = 0.48; // Left-Right
    texture.vOffset = 0.36; // Up-Down
    texture.hasAlpha = true;

    // Tile face material
    material.albedoTexture = texture;
    material.metallic = 0;
    tileFace.material = material;

    // Position tile's Root
    tileMesh.position.y = 0.2;
    tileMesh.rotate(Vector3.Left(), -Math.PI / 2);
    this.tile = tileMesh;
  }

  public setFrontTexture(): void {
    // this.material.setTexture(
    //   "frontTexture",
    //   new Texture(this.textures["Front"].default, this.scene)
    // );
    // this.tile.material = this.shaderMaterial;
  }

  public setRandomTexture(): void {
    // const textureKeys = Object.keys(this.textures);
    // const randomKey =
    //   textureKeys[Math.floor(Math.random() * textureKeys.length)];
    // this.shaderMaterial.setTexture(
    //   "tileTexture",
    //   new Texture(this.textures[randomKey].default, this.scene)
    // );
    // this.tile.material = this.shaderMaterial;
  }

  public getMesh(): Mesh {
    return this.tile;
  }

  public setPosition(position: Vector3): void {
    this.tile.position = position;
  }
}

const getPin8 = (): string => {
  return "./textures/tiles/Pin8.png";
};

const getRandomTexturePath = (): string => {
  return `./textures/tiles/${
    textureNames[Math.floor(Math.random() * textureNames.length)]
  }.png`;
};
const textureNames = [
  "Chun",
  "Haku",
  "Hatsu",
  "Man1",
  "Man2",
  "Man3",
  "Man4",
  "Man5-Dora",
  "Man5",
  "Man6",
  "Man7",
  "Man8",
  "Man9",
  "Nan",
  "Pei",
  "Pin1",
  "Pin2",
  "Pin3",
  "Pin4",
  "Pin5-Dora",
  "Pin5",
  "Pin6",
  "Pin7",
  "Pin8",
  "Pin9",
  "Shaa",
  "Sou1",
  "Sou2",
  "Sou3",
  "Sou4",
  "Sou5-Dora",
  "Sou5",
  "Sou6",
  "Sou7",
  "Sou8",
  "Sou9",
  "Ton",
];
const textures: { [key: string]: any } = {};
