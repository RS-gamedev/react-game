import { EntityElementType } from "../models/EntityElementType";
import { GameTickResult } from "../models/GameTickResult";
import { InventoryItem } from "../models/InventoryItem";
import { VillagerProps } from "../models/VillagerProps";

export function getEmptyGameTickResultObject() {
  return {
    villagers: undefined,
    buildings: undefined,
    mapObjects: undefined,
    inventoryItems: undefined,
  };
}

export function executeTasks(
  villagers: EntityElementType[],
  inventoryItems: InventoryItem[],
  mapObjects: EntityElementType[],
  buildings: EntityElementType[]
): GameTickResult {
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
  let villagersCopy = [...villagers];
  let inventoryItemsCopy = [...inventoryItems];
  let mapObjectsCopy = [...mapObjects];
  let buildingsCopy = [...buildings];

  villagers.forEach((villager) => {
    let toUseVillagers = gameTickResult.villagers || villagersCopy;
    let toUseInventoryItems = gameTickResult.inventoryItems || inventoryItemsCopy;
    let toUseMapObjects = gameTickResult.mapObjects || mapObjectsCopy;
    let toUseBuildings = gameTickResult.buildings || buildingsCopy;

    if (villager.component.props.currentTask) {
      let resultFromVillager = villager.component.props.currentTask(toUseVillagers, villager.component.props.id, toUseInventoryItems, toUseBuildings, toUseMapObjects);
      if (resultFromVillager.villagers) {
        gameTickResult.villagers = resultFromVillager.villagers;
      }
      if (resultFromVillager.buildings) {
        gameTickResult.buildings = resultFromVillager.buildings;
      }
      if (resultFromVillager.inventoryItems) {
        gameTickResult.inventoryItems = resultFromVillager.inventoryItems;
      }
      if (resultFromVillager.mapObjects) {
        gameTickResult.mapObjects = resultFromVillager.mapObjects;
      }
    }
  });
  return gameTickResult;
}
