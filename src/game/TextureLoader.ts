let loadedTextures: { [key: string]: any } | null = null;

export async function loadTextures() {
  if (loadedTextures) {
    return loadedTextures;
  }
  const textureNames = [
    "Back",
    "Chun",
    "Front",
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

  for (const name of textureNames) {
    textures[name] = await import(`../assets/textures/tiles/${name}.png`);
  }

  loadedTextures = textures;

  return textures;
}
