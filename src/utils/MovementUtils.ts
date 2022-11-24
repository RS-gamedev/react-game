import { BuildingProps } from "../models/BuildingProps";
import { Status } from "../models/enums/Status";
import { GameTickResult } from "../models/GameTickResult";
import { Hitbox } from "../models/Hitbox";
import { InventoryItem } from "../models/InventoryItem";
import { ObjectProps } from "../models/ObjectProps";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "./HitboxUtils";
import { getEmptyGameTickResultObject } from "./StatusUtils";

export function getDistance(startPosition: Position, goalPosition: Position) {
  let y = goalPosition.x - startPosition.x;
  let x = goalPosition.y - startPosition.y;
  return Math.sqrt(x * x + y * y);
}

export function getDistanceToHitBox(
  startPosition: Position,
  goalHitbox: Hitbox
) {
  let goalPosition = getHitBoxCenter(goalHitbox);
  let y = goalPosition.x - startPosition.x;
  let x = goalPosition.y - startPosition.y;
  return Math.sqrt(x * x + y * y);
}

export function getNewPosition(
  startPosition: Hitbox,
  goalPosition: Position
): Hitbox {
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

// export function moveVillagerToPosition(villager: VillagerProps, goalPosition: Position) {
//     let villagerCopy = {...villager};
//     villagerCopy.hitBox = getNewPosition(villagerCopy.hitBox, goalPosition);
//     return villagerCopy;
// }

export function moveVillagerToNearestRock(villager: VillagerProps) {
  let goalPosition = { x: 800, y: 800 };
  // goalposition = nearest rock
  return {
    ...villager,
    position: getNewPosition(villager.hitBox, goalPosition),
  };
}

export function doMoveToLocation(
  villagers: VillagerProps[],
  villagerId: string,
  inventoryItems: InventoryItem[],
  buildings: BuildingProps[],
  mapObjects: ObjectProps[],
  goalPosition: Position
): GameTickResult {
  let villagersCopy = [...villagers];
  let updatedVillager = villagersCopy.find((x) => x.id === villagerId);
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
  if (updatedVillager) {
    updatedVillager.status = Status.WALKING;
    if (onGoal(updatedVillager.hitBox, goalPosition)) {
      updatedVillager.status = Status.IDLE;
      updatedVillager.currentTask = undefined;
    } else {
      updatedVillager.hitBox = getNewPosition(
        updatedVillager.hitBox,
        goalPosition
      );
    }
    villagersCopy = villagersCopy.map((vill) => {
      if (updatedVillager && vill.id === updatedVillager.id) {
        return updatedVillager;
      }
      return vill;
    });
  }
  gameTickResult.villagers = villagersCopy;
  return gameTickResult;
}
