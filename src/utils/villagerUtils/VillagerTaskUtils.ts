import { levels } from "../../config/Levels";
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
  targetIsBuilding: boolean,
  taskTargetResource: string, // tree, stone, field
  initialTargetId: string
): GameTickResult {
  let villagersCopy = [...villagers];
  let villagerCopy = villagersCopy.find((x) => x.id === villagerId);
  let inventoryItemsCopy = [...inventoryItems];
  let mapObjectsCopy = [...mapObjects];
  let buildingsCopy = [...buildings];
  let targetObjectCopy = targetIsBuilding ? buildings.find((x) => x.id === initialTargetId):  mapObjectsCopy.find((x) => x.id === initialTargetId);
  if (!targetObjectCopy) {
    // if initial target is not found, set target to villagerCopy.goalObjectId;
    targetObjectCopy = targetIsBuilding
      ? buildings.find((x) => x.id === villagerCopy?.goalObjectId) :mapObjectsCopy.find((x) => x.id === villagerCopy?.goalObjectId);
  }
  let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
  let mapObjectsChanged: boolean = false;
  let inventoryItemsChanged: boolean = false;
  let buildingsChanged: boolean = false;
  if (!villagerCopy || !targetObjectCopy) return gameTickResult;
  let closestStorage = findNearestStorage(
    getHitBoxCenter(villagerCopy?.hitBox),
    (taskTargetResource === "Farm field")? buildings.filter(x => x.type === BuildingType.FARMING_FIELD) : buildings.filter((x) => x.type === BuildingType.TOWN_CENTER)
  );

  villagerCopy = handleIdle(villagerCopy, buildings, mapObjectsCopy, closestStorage, taskTargetResource, targetIsBuilding, targetObjectCopy);
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
        if (sourceHasResourcesLeft(targetObjectCopy)) {
          console.log(targetObjectCopy);
          // Tree has wood
          targetObjectCopy.inventory[0].amount = retract(targetObjectCopy.inventory[0].amount, 0.04);
          mapObjectsCopy = mapObjectsCopy.map((tree) => {
            if (tree.id === targetObjectCopy?.id) {
              mapObjectsChanged = true;
              return targetObjectCopy as ObjectProps;
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
          if(targetIsBuilding){
            buildingsCopy = buildingsCopy.filter(x => x.id !== villagerCopy?.goalObjectId);
            buildingsChanged = true;
          }
          else{
            mapObjectsCopy = mapObjectsCopy.filter((x) => x.id !== villagerCopy?.goalObjectId);
            mapObjectsChanged = true;
          }
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
  if (buildingsChanged) {
    gameTickResult.buildings = buildingsCopy;
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
  targetIsBuilding: boolean,
  targetObject?: ObjectProps | BuildingProps
) {
  if (!targetObject) {
    // find nearest mapObject or building and set target
      villager.goalObjectId = findNearestTarget(
        getHitBoxCenter(villager.hitBox),
        (targetIsBuilding) ? buildings.filter((x) => x.name === taskTargetResource) : mapObjects.filter(x => x.name === taskTargetResource)
      ).id;   

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
      let nearestMapObject = findNearestTarget(
        getHitBoxCenter(villager.hitBox),
        mapObjects.filter((x) => x.name === taskTargetResource)
      );
      villager.goalObjectId = nearestMapObject.id;
    }
  }
  return villager;
}

function sourceHasResourcesLeft(mapObject: ObjectProps | BuildingProps) {
  let mapObjectsItems = mapObject.inventory[0];
  if (mapObject.inventory && mapObjectsItems && mapObjectsItems.amount > 0) {
    return true;
  }
  return false;
}

function achievedNextLevel(experience: number, experienceNeeded: number) {
  return experience >= experienceNeeded;
}

function findNearestTarget(position: Position, objects: ObjectProps[]| BuildingProps[]) {
  let closest: ObjectProps | BuildingProps = objects[0];
  let lowestDistance = 10000;
  for (let object of objects) {
    let distance = getDistance({ x: position.x, y: position.y }, { x: getHitBoxCenter(object.hitBox).x, y: getHitBoxCenter(object.hitBox).y });
    if (distance < lowestDistance) {
      closest = object;
      lowestDistance = distance;
    }
  }
  return closest;
}

export function findNearestStorage(position: Position, storages: BuildingProps[]) {
  let closest: BuildingProps = storages[0];
  let lowestDistance = 10000;
  for (let storage of storages) {
    let distance = getDistance({ x: position.x, y: position.y }, { x: getHitBoxCenter(storage.hitBox).x, y: getHitBoxCenter(storage.hitBox).y });
    if (distance < lowestDistance) {
      closest = storage;
      lowestDistance = distance;
    }
  }
  return closest;
}