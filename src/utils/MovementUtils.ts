import { BuildingProps } from "../models/BuildingProps";
import { Status } from "../models/enums/Status";
import { GameTickResult } from "../models/GameTickResult";
import { Hitbox } from "../models/Hitbox";
import { Inventory } from "../models/Inventory";
import { MapObjectProps } from "../models/MapObjectProps";
import { Position } from "../models/Position";
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
  villagers: VillagerProps[],
  villagerId: string,
  inventory: Inventory,
  buildings: BuildingProps[],
  mapObjects: MapObjectProps[],
  goalPosition: Position,
): GameTickResult | undefined {
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
  const villagerProps = villagers.find(villager => villager.id === villagerId);
  console.log(villagerProps);
  if (!villagerProps) return gameTickResult;

  villagerProps.status = Status.WALKING;
  if (onGoal(villagerProps.hitBox, goalPosition)) {
    villagerProps.status = Status.IDLE;
    villagerProps.currentAction = undefined;
  } else {
    villagerProps.hitBox = getNewPosition(villagerProps.hitBox, goalPosition);
  }

  gameTickResult.villagers = [villagerProps];
  // console.log(gameTickResult);
  return gameTickResult;
}
