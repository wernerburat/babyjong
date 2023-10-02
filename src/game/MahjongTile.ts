import {
  Scene,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

export class MahjongTile {
  private tile: Mesh;
  private scene: Scene;
  private textures: { [key: string]: any };

  constructor(scene: Scene, textures: { [key: string]: any }) {
    this.scene = scene;
    this.textures = textures;
    this.tile = this.createTile();
  }

  private createTile(): Mesh {
    const tileWidth = 0.2794;
    const tileHeight = 0.1905;
    const tileDepth = 0.0457;

    const tile = MeshBuilder.CreateBox(
      "tile",
      { width: tileWidth, height: tileHeight, depth: tileDepth },
      this.scene
    );
    return tile;
  }

  public setFrontTexture(): void {
    const material = new StandardMaterial("baseTileMat", this.scene);
    material.diffuseTexture = new Texture(
      this.textures["Front"].default,
      this.scene
    );
    this.tile.material = material;
  }

  public setRandomTexture(): void {
    const textureKeys = Object.keys(this.textures);
    const randomKey =
      textureKeys[Math.floor(Math.random() * textureKeys.length)];
    const material = new StandardMaterial("tileMat", this.scene);
    material.diffuseTexture = new Texture(
      this.textures[randomKey].default,
      this.scene
    );
    this.tile.material = material;
  }

  public getMesh(): Mesh {
    return this.tile;
  }
}
