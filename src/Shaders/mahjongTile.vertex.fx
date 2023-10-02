struct VertexInputs {
    [[location(0)]] position: vec4<f32>;
    [[location(1)]] uv: vec2<f32>;
};

struct VertexOutputs {
    [[builtin(position)]] position: vec4<f32>;
    [[location(0)]] uv: vec2<f32>;
};


@vertex
fn vertex_main(input: VertexInputs) -> VertexOutputs {
    var output: VertexOutputs;
    output.position = input.position;
    output.uv = input.uv;
    return output;
}
