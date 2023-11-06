import { levels } from "../../config/Levels";
import { BuildingEntity } from "../../models/BuildingEntity";
import { BuildingProps } from "../../models/BuildingProps";
import { BuildingType } from "../../models/enums/BuildingType";
import { Status } from "../../models/enums/Status";
import { GameTickResult } from "../../models/GameTickResult";
import { Inventory } from "../../models/Inventory";
import { InventoryItem } from "../../models/InventoryItem";
import { MapObjectEntity } from "../../models/MapObjectEntity";
import { MapObjectProps } from "../../models/MapObjectProps";
import { Position } from "../../models/Position";
import { VillagerEntity } from "../../models/VillagerEntity";
import { VillagerProps } from "../../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "../HitboxUtils";
import { getDistance, getNewPosition } from "../MovementUtils";
import { add, retract } from "../ResourceUtils";
import { getEmptyGameTickResultObject } from "../StatusUtils";
import { inventoryIsFull } from "../VillagerUtils";

export function doGatheringTask(
  villagers: VillagerEntity[],
  villagerId: string,
  inventory: Inventory,
  buildings: BuildingEntity[],
  mapObjects: MapObjectEntity[],
  targetIsBuilding: boolean,
  taskTargetResource: string, // tree, stone, field
  initialTargetId: string
): GameTickResult {
  let villagersCopy = [...villagers.map(entity => entity.villager)];
  let villagerCopy = villagersCopy.find((entity) => entity.id === villagerId);
  let inventoryCopy = { ...inventory };
  let mapObjectsCopy = [...mapObjects.map(entity => entity.mapObject)];
  let buildingsCopy = [...buildings.map(entity => entity.building)];
  let targetObjectCopy = targetIsBuilding ? buildingsCopy.find((x) => x.id === initialTargetId) : mapObjectsCopy.find((x) => x.id === initialTargetId);
  if (!targetObjectCopy) {
    // if initial target is not found, set target to villagerCopy.goalObjectId;
    targetObjectCopy = targetIsBuilding
      ? buildingsCopy.find((x) => x.id === villagerCopy?.goalObjectId)
      : mapObjectsCopy.find((x) => x.id === villagerCopy?.goalObjectId);
  }
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
  let mapObjectsChanged: boolean = false;
  let inventoryItemsChanged: boolean = false;
  let buildingsChanged: boolean = false;
  if (!villagerCopy) return gameTickResult;
  let closestStorage = getNearestBuilding(
    getHitBoxCenter(villagerCopy?.hitBox),
    taskTargetResource === "Farm field"
      ? buildingsCopy.filter((entity) => entity.type === BuildingType.MILL)
      : buildingsCopy.filter((entity) => entity.type === BuildingType.TOWN_CENTER)
  );

  villagerCopy = handleIdle(villagerCopy, buildingsCopy, mapObjectsCopy, closestStorage, taskTargetResource, targetIsBuilding, targetObjectCopy);
  let currentProfession = villagerCopy.professions.find((x) => x.active);
  if (!currentProfession) return gameTickResult;
  switch (villagerCopy.status) {
    case Status.WALKING_TO_RESOURCE:
      if (targetObjectCopy) {
        villagerCopy.hitBox = getNewPosition(villagerCopy.hitBox, getHitBoxCenter(targetObjectCopy.hitBox!));
        if (targetObjectCopy && onGoal(villagerCopy.hitBox, getHitBoxCenter(targetObjectCopy?.hitBox))) {
          villagerCopy.status = Status.IDLE;
          targetObjectCopy = undefined;
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
        if (sourceHasResourcesLeft(targetObjectCopy)) {
          // Tree has wood
          targetObjectCopy.inventory[0].amount = retract(targetObjectCopy.inventory[0].amount, 0.04);
          mapObjectsCopy = mapObjectsCopy.map((tree) => {
            if (tree.id === targetObjectCopy?.id) {
              mapObjectsChanged = true;
              return targetObjectCopy as MapObjectProps;
            }
            return tree;
          });
          buildingsCopy = buildingsCopy.map((building) => {
            if (building.id === targetObjectCopy?.id) {
              buildingsChanged = true;
              return targetObjectCopy as BuildingProps;
            }
            return building;
          });
          mapObjectsChanged = true;
          let toAddResource = villagerCopy.inventoryItems.find((x) => x.resource.id === targetObjectCopy?.inventory[0].resource.id);
          if (toAddResource) {
            toAddResource.amount = add(toAddResource.amount, 0.04);
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
        if (!sourceHasResourcesLeft(targetObjectCopy)) {
          targetObjectCopy = undefined;
          if (targetIsBuilding) {
            buildingsCopy = buildingsCopy.filter((x) => x.id !== villagerCopy?.goalObjectId);
            buildingsChanged = true;
          } else {
            mapObjectsCopy = mapObjectsCopy.filter((x) => x.id !== villagerCopy?.goalObjectId);
            mapObjectsChanged = true;
          }
          villagerCopy.goalObjectId = undefined;
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
        if (inventoryCopy) {
          let inventoryResource = inventoryCopy.resources.find((x) => x.resource.name === invItem.resource.name);
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
    gameTickResult.inventory = inventoryCopy;
  }
  if (buildingsChanged) {
    gameTickResult.buildings = buildingsCopy;
  }
  gameTickResult.villagers = villagersCopy;
  return gameTickResult;
}

function handleIdle(
  villager: VillagerProps,
  buildings: BuildingProps[],
  mapObjects: MapObjectProps[],
  closestStorage: BuildingProps,
  taskTargetResource: string,
  targetIsBuilding: boolean,
  targetObject?: BuildingProps | MapObjectProps
) {
  if (!targetObject) {
    // find nearest mapObject or building and set target
    villager.goalObjectId = getNearest(
      getHitBoxCenter(villager.hitBox),
      targetIsBuilding ? buildings.filter((x) => x.name === taskTargetResource) : mapObjects.filter((x) => x.name === taskTargetResource)
    ).id;
    if (!villager.goalObjectId) {
      villager.currentAction = undefined;
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
      let nearestMapObject = getNearest(
        getHitBoxCenter(villager.hitBox),
        mapObjects.filter((x) => x.name === taskTargetResource)
      );
      villager.goalObjectId = nearestMapObject.id;
    }
  }
  return villager;
}

function sourceHasResourcesLeft(mapObject: MapObjectProps | BuildingProps) {
  let mapObjectsItems = mapObject.inventory[0];
  if (mapObject.inventory && mapObjectsItems && mapObjectsItems.amount > 0) {
    return true;
  }
  return false;
}

function achievedNextLevel(experience: number, experienceNeeded: number) {
  return experience >= experienceNeeded;
}

export function getNearest(position: Position, entity: (MapObjectProps | BuildingProps)[]) {
  let closest: MapObjectProps | BuildingProps = entity[0];
  let lowestDistance = 10000;
  for (let storage of entity) {
    let distance = getDistance({ x: position.x, y: position.y }, { x: getHitBoxCenter(storage.hitBox).x, y: getHitBoxCenter(storage.hitBox).y });
    if (distance < lowestDistance) {
      closest = storage;
      lowestDistance = distance;
    }
  }
  return closest;
}

export function getNearestBuilding(position: Position, entity: BuildingProps[]) {
  let closest: BuildingProps = entity[0];
  let lowestDistance = 10000;
  for (let storage of entity) {
    let distance = getDistance({ x: position.x, y: position.y }, { x: getHitBoxCenter(storage.hitBox).x, y: getHitBoxCenter(storage.hitBox).y });
    if (distance < lowestDistance) {
      closest = storage;
      lowestDistance = distance;
    }
  }
  return closest;
}

