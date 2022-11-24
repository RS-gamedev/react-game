import { BuildingProps } from "../models/BuildingProps";
import { GameTickResult } from "../models/GameTickResult";
import { InventoryItem } from "../models/InventoryItem";
import { ObjectProps } from "../models/ObjectProps";
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
  villagers: VillagerProps[],
  inventoryItems: InventoryItem[],
  mapObjects: ObjectProps[],
  buildings: BuildingProps[]
): GameTickResult {
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
  let villagersCopy = [...villagers];
  let inventoryItemsCopy = [...inventoryItems];
  let mapObjectsCopy = [...mapObjects];
  let buildingsCopy = [...buildings];

  villagers.forEach((villager) => {
    let toUseVillagers = gameTickResult.villagers ? gameTickResult.villagers : villagersCopy;
    let toUseInventoryItems = gameTickResult.inventoryItems ? gameTickResult.inventoryItems : inventoryItemsCopy;
    let toUseMapObjects = gameTickResult.mapObjects ? gameTickResult.mapObjects : mapObjectsCopy;
    let toUseBuildings = gameTickResult.buildings ? gameTickResult.buildings : buildingsCopy;

    if (villager.currentTask) {
      let resultFromVillager = villager.currentTask(toUseVillagers, villager.id, toUseInventoryItems, toUseBuildings, toUseMapObjects);
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
