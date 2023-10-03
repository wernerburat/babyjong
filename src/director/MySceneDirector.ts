import { ref } from "vue";
import {
  SceneDirectorEventBusMessages,
  SceneEventBusMessages,
} from "../bus/events";
import { BaseSceneDirector } from "./BaseSceneDirector";

export class MySceneDirector extends BaseSceneDirector {
  private _selectedTileName = ref("");

  constructor() {
    super();
    this.registerSceneEvents();
  }

  // register your events here
  // you might want to make this in a more configurable way (like in MarbleScene.getMessagesToActionsMapping())
  // and move these two methods to BaseSceneDirector
  // and call registerSceneEvents(messageToActionMappings)
  private registerSceneEvents() {
    this.asyncBus.$on(SceneEventBusMessages.TileSelected, (name: string) => {
      console.log("Tile selected", name);
      this._selectedTileName.value = name;
    });
  }

  // unregister your events here
  public unregisterSceneEvents() {
    this.asyncBus.$off(SceneEventBusMessages.TileSelected);
  }

  //

  async getMeshNames() {
    const retvalue = await this.asyncCommand(
      SceneDirectorEventBusMessages.GetMeshNames,
      {}
    );
    return retvalue;
  }

  async createTiles(amount: number) {
    void this.asyncCommand(SceneDirectorEventBusMessages.CreateTiles, amount);
  }

  // async addMarble(name: string) {
  //   void this.asyncCommand(SceneDirectorEventBusMessages.AddMarble, name);
  // }

  // Vue reactive stuff
  useSelectedMarbleName() {
    return this._selectedTileName;
  }
}
