import { EntityElementType } from "../models/EntityElementType";
import { Status } from "../models/enums/Status";
import { GameTickResult } from "../models/GameTickResult";
import { Hitbox } from "../models/Hitbox";
import { InventoryItem } from "../models/InventoryItem";
import { Position } from "../models/Position";
import { VillagerEntity } from "../models/VillagerEntity";
import { VillagerProps } from "../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "./HitboxUtils";
import { getEmptyGameTickResultObject } from "./StatusUtils";

export function getDistance(startPosition: Position, goalPosition: Position) {
  let y = goalPosition.x - startPosition.x;
  let x = goalPosition.y - startPosition.y;
  return Math.sqrt(x * x + y * y);
}

export function getNewPosition(startPosition: Hitbox, goalPosition: Position): Hitbox {
  let newPosition: Hitbox = { ...startPosition };
  let center = getHitBoxCenter(newPosition);
  if (goalPosition.x - center.x >= 10) {
    newPosition.leftTop.x += 8;
    newPosition.rightBottom.x += 8;
  } else if (goalPosition.x - center.x <= 10) {
    newPosition.leftTop.x -= 8;
    newPosition.rightBottom.x -= 8;
  }

  if (goalPosition.y - center.y >= 10) {
    newPosition.leftTop.y += 8;
    newPosition.rightBottom.y += 8;
  } else if (goalPosition.y - center.y <= 10) {
    newPosition.leftTop.y -= 8;
    newPosition.rightBottom.y -= 8;
  }
  return newPosition;
}

export function doMoveToLocation(
  villagers: VillagerEntity[],
  villagerId: string,
  inventoryItems: InventoryItem[],
  buildings: EntityElementType[],
  mapObjects: EntityElementType[],
  goalPosition: Position,
): VillagerProps | undefined {
  // let villagersCopy = [...villagers];
  let updatedVillager = villagers.find(villager => villager.villager.id === villagerId)?.villager;
  // let gameTickResult: GameTickResult = getEmptyGameTickResultObject();

  if (updatedVillager) {
    updatedVillager.status = Status.WALKING;
    if (onGoal(updatedVillager.hitBox, goalPosition)) {
      updatedVillager.status = Status.IDLE;
      updatedVillager.currentAction = undefined;
    } else {
      updatedVillager.hitBox = getNewPosition(updatedVillager.hitBox, goalPosition);
    }
    // villagersCopy = villagersCopy.map((vill) => {
    //   if (updatedVillager && vill.id === updatedVillager.id) {
    //     return updatedVillager;
    //   }
    //   return vill;
    // });
    return updatedVillager;
  }
  // villagersCopy = villagersCopy.map((vill) => {
  //   if (updatedVillager && vill.id === updatedVillager.id) {
  //     return updatedVillager;
  //   }
  //   return vill;
  // });
  return undefined;
}
