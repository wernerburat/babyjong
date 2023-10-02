struct FragmentInputs {
    [[location(0)]] uv: vec2<f32>;
};

struct FragmentOutputs {
    [[location(0)]] color: vec4<f32>;
};

// Samplers and Textures
[[group(0), binding(0)]] var frontTexture: texture_2d<f32>;
[[group(0), binding(1)]] var tileTexture: texture_2d<f32>;

[[group(1), binding(0)]] var frontSampler: sampler;
[[group(1), binding(1)]] var tileSampler: sampler;

@fragment
fn fragment_main(input: FragmentInputs) -> FragmentOutputs {
    var output: FragmentOutputs;

    // Sample the colors from the textures
    let frontColor = textureSample(frontTexture, frontSampler, input.uv);
    let tileColor = textureSample(tileTexture, tileSampler, input.uv);

    // Mix the colors: If the tile texture has transparency, it will blend with the front texture
    output.color = mix(frontColor, tileColor, tileColor.a);

    return output;
}
