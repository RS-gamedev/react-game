import { levels } from "../../config/Levels";
import { resources } from "../../config/Resources";
import { BuildingProps } from "../../models/BuildingProps";
import { BuildingType } from "../../models/enums/BuildingType";
import { Status } from "../../models/enums/Status";
import { GameTickResult } from "../../models/GameTickResult";
import { InventoryItem } from "../../models/InventoryItem";
import { ObjectProps } from "../../models/ObjectProps";
import { Position } from "../../models/Position";
import { VillagerProps } from "../../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "../HitboxUtils";
import { getDistance, getNewPosition } from "../MovementUtils";
import { add, retract } from "../ResourceUtils";
import { getEmptyGameTickResultObject } from "../StatusUtils";
import { inventoryIsFull } from "../VillagerUtils";

export function doGatheringTask(
  villagers: VillagerProps[],
  villagerId: string,
  inventoryItems: InventoryItem[],
  buildings: BuildingProps[],
  mapObjects: ObjectProps[],
  taskTargetResource: string, // tree, stone, field
  initialTargetId: string
): GameTickResult {
  let villagersCopy = [...villagers];
  let villagerCopy = villagersCopy.find((x) => x.id === villagerId);
  let inventoryItemsCopy = [...inventoryItems];
  let mapObjectsCopy = [...mapObjects];
  let targetObjectCopy = mapObjectsCopy.find((x) => x.id === initialTargetId);
  if (!targetObjectCopy) {
    // if initial target is not found, set target to villagerCopy.goalObjectId;
    targetObjectCopy = mapObjectsCopy.find((x) => x.id === villagerCopy?.goalObjectId);
  }
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
  let mapObjectsChanged: boolean = false;
  let inventoryItemsChanged: boolean = false;
  if (!villagerCopy) return gameTickResult;
  let closestStorage = findNearestStorage(
    getHitBoxCenter(villagerCopy?.hitBox),
    buildings.filter((x) => x.type === BuildingType.TOWN_CENTER)
  );

  villagerCopy = handleIdle(villagerCopy, buildings, mapObjectsCopy, closestStorage, taskTargetResource, targetObjectCopy);
  let currentProfession = villagerCopy.professions.find((x) => x.active);
  if (!currentProfession) return gameTickResult;
  switch (villagerCopy.status) {
    case Status.WALKING_TO_RESOURCE:
      if (targetObjectCopy) {
        villagerCopy.hitBox = getNewPosition(villagerCopy.hitBox, getHitBoxCenter(targetObjectCopy?.hitBox!));
        if (targetObjectCopy && onGoal(villagerCopy.hitBox, getHitBoxCenter(targetObjectCopy?.hitBox))) {
          villagerCopy.status = Status.IDLE;
        }
      } else {
        villagerCopy.status = Status.IDLE;
      }
      break;
    case Status.GATHERING_RESOURCE:
      if (inventoryIsFull(villagerCopy)) {
        villagerCopy.status = Status.IDLE;
        break;
      }

      if (targetObjectCopy) {
        if (mapObjectHasResources(targetObjectCopy)) {
          // Tree has wood
          targetObjectCopy.inventory[0].amount = retract(targetObjectCopy.inventory[0].amount, 0.05);
          mapObjectsCopy = mapObjectsCopy.map((tree) => {
            if (tree.id === targetObjectCopy?.id) {
              return targetObjectCopy;
            }
            return tree;
          });
          mapObjectsChanged = true;
          let toAddResource = villagerCopy.inventoryItems.find((x) => x.resource.id === targetObjectCopy?.inventory[0].resource.id);
          if (toAddResource) {
            toAddResource.amount = add(toAddResource.amount, 0.02);
            currentProfession.currentExperience = add(currentProfession.currentExperience, 0.2);
            if (
              achievedNextLevel(currentProfession.currentExperience, currentProfession?.currentLevel.experienceNeededForNextLevel) &&
              currentProfession.currentLevel.nextLevel !== ""
            ) {
              let nextLevel = levels.find((x) => x.id === currentProfession?.currentLevel.nextLevel);
              currentProfession.currentLevel = nextLevel ? nextLevel : currentProfession.currentLevel;
              currentProfession.currentExperience = 0;
            }
          } else {
            villagerCopy.inventoryItems.push({ resource: targetObjectCopy.inventory[0].resource, amount: 0 });
          }
        }
        if (!mapObjectHasResources(targetObjectCopy)) {
          mapObjectsCopy = mapObjectsCopy.filter((x) => x.id !== villagerCopy?.goalObjectId);
          mapObjectsChanged = true;
          villagerCopy.status = Status.IDLE;
        }
      } else {
        villagerCopy.status = Status.IDLE;
      }

      break;
    case Status.RETURNING_RESOURCES:
      villagerCopy.hitBox = getNewPosition(villagerCopy.hitBox, closestStorage.position);
      if (onGoal(villagerCopy.hitBox, closestStorage.position)) {
        villagerCopy.status = Status.IDLE;
      }
      break;
    case Status.DROPPING_RESOURCES:
      villagerCopy.inventoryItems.forEach((invItem) => {
        if (inventoryItemsCopy) {
          let inventoryResource = inventoryItemsCopy.find((x) => x.resource.name === invItem.resource.name);
          if (inventoryResource) {
            inventoryItemsChanged = true;
            inventoryResource.amount = add(inventoryResource.amount, invItem.amount);
            invItem.amount = 0;
          }
        }
      });
      villagerCopy.status = Status.IDLE;
      break;
    default:
      break;
  }
  villagersCopy = villagersCopy.map((vill) => {
    if (villagerCopy && vill.id === villagerCopy.id) {
      return villagerCopy;
    }
    return vill;
  });

  if (mapObjectsChanged) {
    gameTickResult.mapObjects = mapObjectsCopy;
  }
  if (inventoryItemsChanged) {
    gameTickResult.inventoryItems = inventoryItemsCopy;
  }
  gameTickResult.villagers = villagersCopy;
  return gameTickResult;
}

function handleIdle(
  villager: VillagerProps,
  buildings: BuildingProps[],
  mapObjects: ObjectProps[],
  closestStorage: BuildingProps,
  taskTargetResource: string,
  targetObject?: ObjectProps
) {
  if (!targetObject) {
    // find nearest tree and set target
    villager.goalObjectId = findNearestMapObject(
      getHitBoxCenter(villager.hitBox),
      mapObjects.filter((x) => x.name === taskTargetResource)
    )?.id;
    if (!villager.goalObjectId) {
      villager.currentTask = undefined;
      villager.status = Status.IDLE;
    }
    return villager;
  }
  if (inventoryIsFull(villager)) {
    //Inventory vol
    if (onGoal(villager.hitBox, getHitBoxCenter(closestStorage.hitBox))) {
      // On storage
      villager.status = Status.DROPPING_RESOURCES;
    } else {
      // Setting goal to nearest storage
      villager.status = Status.RETURNING_RESOURCES;
    }
  } else {
    // Inventory leeg
    if (targetObject) {
      // Target is set
      if (onGoal(villager.hitBox, getHitBoxCenter(targetObject.hitBox))) {
        // On tree
        villager.status = Status.GATHERING_RESOURCE;
      } else {
        // Walking to target
        villager.status = Status.WALKING_TO_RESOURCE;
        villager.goalObjectId = targetObject.id;
      }
    } else {
      // geen target
      villager.status = Status.WALKING_TO_RESOURCE;
      let nearestMapObject = findNearestMapObject(
        getHitBoxCenter(villager.hitBox),
        mapObjects.filter((x) => x.name === taskTargetResource)
      );
      villager.goalObjectId = nearestMapObject.id;
    }
  }
  return villager;
}

function mapObjectHasResources(mapObject: ObjectProps) {
  let mapObjectsItems = mapObject.inventory[0];
  if (mapObject.inventory && mapObjectsItems && mapObjectsItems.amount > 0) {
    return true;
  }
  return false;
}

function achievedNextLevel(experience: number, experienceNeeded: number) {
  return experience >= experienceNeeded;
}

function findNearestMapObject(position: Position, mapObjects: ObjectProps[]) {
  let closest: ObjectProps = mapObjects[0];
  let lowestDistance = 10000;
  for (let mapObject of mapObjects) {
    let distance = getDistance({ x: position.x, y: position.y }, { x: mapObject.position.x, y: mapObject.position.y });
    if (distance < lowestDistance) {
      closest = mapObject;
      lowestDistance = distance;
    }
  }
  return closest;
}

export function findNearestStorage(position: Position, storages: BuildingProps[]) {
  let closest: BuildingProps = storages[0];
  let lowestDistance = 10000;
  for (let storage of storages) {
    let distance = getDistance({ x: position.x, y: position.y }, { x: storage.position.x, y: storage.position.y });
    if (distance < lowestDistance) {
      closest = storage;
      lowestDistance = distance;
    }
  }
  return closest;
}
