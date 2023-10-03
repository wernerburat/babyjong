let loadedTextures: { [key: string]: any } | null = null;

export async function loadTextures() {
  if (loadedTextures) {
    return loadedTextures;
  }

  for (const name of textureNames) {
    textures[name] = await import(`../assets/textures/tiles/${name}.png`);
  }

  loadedTextures = textures;

  return textures;
}
