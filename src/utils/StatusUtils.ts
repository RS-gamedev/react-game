import { BuildingEntity } from "../models/BuildingEntity";
import { BuildingProps } from "../models/BuildingProps";
import { GameTickResult } from "../models/GameTickResult";
import { Inventory } from "../models/Inventory";
import { MapObjectEntity } from "../models/MapObjectEntity";
import { MapObjectProps } from "../models/MapObjectProps";
import { VillagerEntity } from "../models/VillagerEntity";
import { VillagerProps } from "../models/VillagerProps";

export function getEmptyGameTickResultObject() {
  return {
    villagers: [],
    buildings: [],
    mapObjects: [],
    inventory: undefined,
    updatedVillagers: []
  };
}

export function getVillagerActionsResult(
  villagers: VillagerProps[],
  inventory: Inventory,
  mapObjects: MapObjectProps[],
  buildings: BuildingProps[]
): GameTickResult {
  console.log(villagers);
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();

  let updatedVillagers: VillagerProps[] = [...villagers];
  let updatedBuildings: BuildingProps[] = [...buildings];
  let updatedMapObjects: MapObjectProps[] = [...mapObjects];
  let updatedInventory: Inventory;
  // console.log(villagers);
  villagers.forEach((villager) => {
    let toUseVillagers = gameTickResult.villagers.length > 0 ? gameTickResult.villagers : updatedVillagers;
    let toUseInventory = gameTickResult.inventory || updatedInventory;
    let toUseMapObjects = gameTickResult.mapObjects.length > 0 ? gameTickResult.mapObjects : updatedMapObjects;
    let toUseBuildings = gameTickResult.buildings.length > 0 ? gameTickResult : updatedBuildings;

    if (villager.currentAction) {
      let resultFromVillager: GameTickResult = villager.currentAction(toUseVillagers, villager.id, toUseInventory, toUseBuildings, toUseMapObjects);
      console.log("result from action");
      // console.log(resultFromVillager);
      // resultFromVillager.villagers.forEach(villager => {
      //   if (!updatedVillagers.find(vill => vill.id === villager.id)) updatedVillagers.push(villager);
      // })

      // if (resultFromVillager.villagers) {
      //   gameTickResult.villagers = resultFromVillager.villagers;
      //   resultFromVillager.forEach((x: any) => {
      //     if (!updatedVillagers.includes(resultFromVillager.updatedVillagerIds)) {
      //       updatedVillagers.push(x);
      //     }
      //   })
      // }
      // if (resultFromVillager.buildings) {
      //   gameTickResult.buildings = resultFromVillager.buildings;
      // }
      // if (resultFromVillager.inventory) {
      //   gameTickResult.inventory = resultFromVillager.inventory;
      // }
      // if (resultFromVillager.mapObjects) {
      //   gameTickResult.mapObjects = resultFromVillager.mapObjects;
      // }
    }
  });

  // console.log(updatedVillagers);


  // console.log(gameTickResult);
  return gameTickResult;
}
