export enum SceneDirectorEventBusMessages {
  SceneDirectorCommand = "command",
  SceneDirectorCommandFinished = "commandFinished",

  HideInspector = "hideInspector",
  ShowInspector = "showInspector",
  ClearTiles = "clearTiles",
  CreateTiles = "createTiles",
  AddTile = "addTile",
  GetTiles = "getTiles",
  GetMeshNames = "getMeshNames",
}

export enum SceneEventBusMessages {
  SceneDirectorCommandFinished = "commandFinished",

  TileSelected = "tileSelected",
}
