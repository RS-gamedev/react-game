import { BuildingProps } from "../models/BuildingProps";
import { GameTickResult } from "../models/GameTickResult";
import { Inventory } from "../models/Inventory";
import { MapObjectProps } from "../models/MapObjectProps";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { doMoveToLocation } from "./MovementUtils";

export function getEmptyGameTickResultObject(
  villagers: VillagerProps[],
  buildings: BuildingProps[],
  mapObjects: MapObjectProps[],
  inventory: Inventory
): GameTickResult {
  return {
    villagers: villagers.map((vill) => {
      return { villager: vill, updated: false };
    }),
    buildings: buildings.map((buil) => {
      return { building: buil, updated: false };
    }),
    mapObjects: mapObjects.map((mapO) => {
      return { mapObject: mapO, updated: false };
    }),
    inventory: { inventory: inventory, updated: false },
  };
}

export function getVillagerActionsResult(
  villagers: VillagerProps[],
  inventory: Inventory,
  mapObjects: MapObjectProps[],
  buildings: BuildingProps[]
): GameTickResult {
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject(villagers, buildings, mapObjects, inventory);
  gameTickResult.villagers.forEach((villagerGT) => {
    if (villagerGT.villager.currentAction) {
      villagerGT.villager.currentAction(
        gameTickResult.villagers.map((x) => x.villager),
        villagerGT.villager.id,
        inventory,
        buildings,
        mapObjects,
        gameTickResult
      );
    }
  });
  return gameTickResult;
}
export enum VillagerActionType {
  MOVE_TO_POSITION,
  GATHER_RESOURCE,
  ATTACK,
  NONE,
}

type ActionParams = {
  clickedPosition: Position;
  type: VillagerActionType;
};

export const createVillagerAction = (additionalParams: ActionParams) => {
  return (
    villagers: VillagerProps[],
    villagerId: string,
    inventory: Inventory,
    buildings: BuildingProps[],
    mapObjects: MapObjectProps[],
    gameTickResult: GameTickResult
  ): GameTickResult => {
    switch (additionalParams.type) {
      case VillagerActionType.MOVE_TO_POSITION:
        const clickedPosition = additionalParams.clickedPosition;
        return doMoveToLocation(villagerId, clickedPosition, gameTickResult);
      default:
        return gameTickResult;
    }
  };
};
