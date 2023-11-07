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
  villagerId: string,
  goalPosition: Position,
  gameTickResult: GameTickResult,
): GameTickResult {
  const villagerPropsGameTick = gameTickResult?.villagers.find((villager) => villager.villager.id === villagerId);
  if (!villagerPropsGameTick) return gameTickResult!;
  villagerPropsGameTick.updated = true;

  if (onGoal(villagerPropsGameTick.villager.hitBox, goalPosition)) {
    villagerPropsGameTick.villager.status = Status.IDLE;
    villagerPropsGameTick.villager.currentAction = undefined;
  } else {
    villagerPropsGameTick.villager.status = Status.WALKING;
    villagerPropsGameTick.villager.hitBox = getNewPosition(villagerPropsGameTick.villager.hitBox, goalPosition);
  }
  return gameTickResult;
}
