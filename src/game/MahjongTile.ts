import {
  Scene,
  MeshBuilder,
  Mesh,
  Texture,
  ShaderMaterial,
  Effect,
  ShaderStore,
} from "@babylonjs/core";

Effect.ShadersStore["customVertexShader"] = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 worldViewProjection;
    varying vec2 vUV;

    attribute vec3 normal;
    varying vec3 vNormal;

    void main() {
        vUV = uv;
        vec4 p = vec4(position, 1.);
        vNormal = normal;
        gl_Position = worldViewProjection * p;
    }
`;
Effect.ShadersStore["customFragmentShader"] = `
    precision highp float;
    varying vec3 vNormal;
    uniform sampler2D frontTexture;
    uniform sampler2D tileTexture;

    void main() {
        vec4 frontColor = texture2D(frontTexture, vUV);
        vec4 tileColor = texture2D(tileTexture, vUV);

        // Use a multiplier based on the normal. If Y component of normal is 1, we're on the top face.
        float faceMultiplier = (vNormal.y > 0.9) ? 1.0 : 0.0;

        // Mix the colors based on the multiplier
        vec4 finalColor = mix(frontColor, tileColor, tileColor.a * faceMultiplier);

        gl_FragColor = finalColor;
    }
`;

// void main() {
//     vec4 frontColor = texture2D(frontTexture, vUV);
//     vec4 tileColor = texture2D(tileTexture, vUV);

//     float faceMultiplier = (vUV.x < 0.1667) ? 1.0 : 0.0;
//     vec4 finalColor = mix(frontColor, tileColor, tileColor.a * faceMultiplier);

//     gl_FragColor = finalColor;
// }

export class MahjongTile {
  private tile: Mesh;
  private scene: Scene;
  private textures: { [key: string]: any };
  private shaderMaterial: ShaderMaterial;

  constructor(scene: Scene, textures: { [key: string]: any }) {
    this.scene = scene;
    this.textures = textures;
    this.tile = this.createTile();
    this.shaderMaterial = this.createShaderMaterial();
    this.setFrontTexture();
  }

  private createTile(): Mesh {
    const tileDepth = 0.1905;
    const tileWidth = 0.2794;
    const tileHeight = 0.0457;

    const tile = MeshBuilder.CreateBox(
      "tile",
      { width: tileWidth, height: tileHeight, depth: tileDepth },
      this.scene
    );

    // Rotate the tile to lay it flat
    //tile.rotation.x = Math.PI / 2; // Rotate around the X axis by 90 degrees

    return tile;
  }

  private createShaderMaterial(): ShaderMaterial {
    const shaderMaterial = new ShaderMaterial("custom", this.scene, "custom", {
      attributes: ["position", "normal", "uv"],
      uniforms: ["worldViewProjection", "frontTexture", "tileTexture"],
    });
    return shaderMaterial;
  }

  public setFrontTexture(): void {
    this.shaderMaterial.setTexture(
      "frontTexture",
      new Texture(this.textures["Front"].default, this.scene)
    );
    this.tile.material = this.shaderMaterial;
  }

  public setRandomTexture(): void {
    const textureKeys = Object.keys(this.textures);
    const randomKey =
      textureKeys[Math.floor(Math.random() * textureKeys.length)];
    this.shaderMaterial.setTexture(
      "tileTexture",
      new Texture(this.textures[randomKey].default, this.scene)
    );
    this.tile.material = this.shaderMaterial;
  }

  public getMesh(): Mesh {
    return this.tile;
  }
}
