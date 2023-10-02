import {
  Scene,
  MeshBuilder,
  Mesh,
  Texture,
  ShaderMaterial,
  Effect,
  ShaderStore,
  UniformBuffer,
  ShaderLanguage,
  TextureSampler,
  Constants,
} from "@babylonjs/core";

ShaderStore.ShadersStoreWGSL["customVertexShader"] = `
    #include<sceneUboDeclaration>
    #include<meshUboDeclaration>

    attribute position : vec3<f32>;
    attribute normal : vec3<f32>;
    attribute uv: vec2<f32>;

    varying vNormal : vec3<f32>;
    varying vUV : vec2<f32>;

    struct MyUBO {
        scale: f32,
    };

    var<uniform> myUBO: MyUBO;

    @vertex
    fn main(input : VertexInputs) -> FragmentInputs {
        vertexOutputs.position = scene.viewProjection * mesh.world * vec4<f32>(vertexInputs.position * vec3<f32>(myUBO.scale), 1.0);
        vertexOutputs.vNormal = vertexInputs.normal;
        vertexOutputs.vUV = vertexInputs.uv;
    }
`;
ShaderStore.ShadersStoreWGSL["customFragmentShader"] = `
    uniform vColor : array<vec4<f32>, 2>;

    varying vNormal : vec3<f32>;
    varying vUV : vec2<f32>;

    var frontTexture : texture_2d<f32>;
    var tileTexture : texture_2d<f32>;
    var mySampler : sampler;

    @fragment
    fn main(input : FragmentInputs) -> FragmentOutputs {
            let frontColor : vec4<f32> = textureSample(frontTexture, mySampler, fragmentInputs.vUV);
            let tileColor : vec4<f32> = textureSample(tileTexture, mySampler, fragmentInputs.vUV);

            // Use a multiplier based on the normal. If Y component of normal is close to 1, we're on the top face.
            let faceMultiplier : f32 = select(0.0, 1.0, fragmentInputs.vNormal.y > 0.8);

            // Mix the colors based on the multiplier
            let finalColor : vec4<f32> = mix(frontColor, tileColor, tileColor.a * faceMultiplier);

            fragmentOutputs.color = finalColor * uniforms.vColor[1];
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
  private myUBO: UniformBuffer;

  constructor(scene: Scene, textures: { [key: string]: any }) {
    this.scene = scene;
    this.textures = textures;
    this.myUBO = this.createUBO();
    this.tile = this.createTile();
    this.shaderMaterial = this.createShaderMaterial();

    this.setFrontTexture();
  }

  private createUBO(): UniformBuffer {
    const myUBO = new UniformBuffer(this.scene.getEngine());
    myUBO.addUniform("scale", 1.0);
    myUBO.updateFloat("scale", 3);
    myUBO.update();

    return myUBO;
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
    const shaderMaterial = new ShaderMaterial(
      "custom",
      this.scene,
      { vertex: "custom", fragment: "custom" },
      {
        attributes: ["position", "normal", "uv"],
        uniformBuffers: ["Scene", "Mesh"],
        shaderLanguage: ShaderLanguage.WGSL,
      }
    );
    shaderMaterial.setFloats("vColor", [1, 1, 1, 1, 1, 1, 1, 1]);
    shaderMaterial.setUniformBuffer("myUBO", this.myUBO);

    const sampler = new TextureSampler();
    sampler.setParameters(); // Use default values
    sampler.samplingMode = Constants.TEXTURE_NEAREST_SAMPLINGMODE;

    shaderMaterial.setTextureSampler("mySampler", sampler);

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
