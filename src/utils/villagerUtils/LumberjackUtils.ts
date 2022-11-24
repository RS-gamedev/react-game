import { levels } from "../../config/Levels";
import { resources } from "../../config/Resources";
import { BuildingProps } from "../../models/BuildingProps";
import { BuildingType } from "../../models/enums/BuildingType";
import { Status } from "../../models/enums/Status";
import { GameTickResult } from "../../models/GameTickResult";
import { InventoryItem } from "../../models/InventoryItem";
import { ObjectProps } from "../../models/ObjectProps";
import { VillagerProps } from "../../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "../HitboxUtils";
import { findNearestStorage, findNearestTree } from "../MapObjectUtils";
import { getNewPosition } from "../MovementUtils";
import { add, retract } from "../ResourceUtils";
import { getEmptyGameTickResultObject } from "../StatusUtils";
import { inventoryIsFull } from "../VillagerUtils";

export function doWoodcutting(villagers: VillagerProps[], villagerId: string, inventoryItems: InventoryItem[], buildings: BuildingProps[], mapObjects: ObjectProps[], initialTargetId: string): GameTickResult {
    let villagersCopy = [...villagers];
    let villagerCopy = villagersCopy.find(x => x.id === villagerId);
    let inventoryItemsCopy = [...inventoryItems];
    let mapObjectsCopy = [...mapObjects];
    let targetObjectCopy = mapObjectsCopy.find(x => x.id === initialTargetId);
    if (!targetObjectCopy) {
        // if initial target is not found, set target to villagerCopy.goalObjectId;
        targetObjectCopy = mapObjectsCopy.find(x => x.id === villagerCopy?.goalObjectId);
    }
    let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
    let mapObjectsChanged: boolean = false;
    let inventoryItemsChanged: boolean = false;
    if (!villagerCopy) return gameTickResult;
    let closestStorage = findNearestStorage(getHitBoxCenter(villagerCopy?.hitBox), buildings.filter(x => x.type === BuildingType.TOWN_CENTER))

    villagerCopy = handleIdle(villagerCopy, buildings, mapObjectsCopy, closestStorage, targetObjectCopy);
    let currentProfession = villagerCopy.professions.find(x => x.active);
    if(!currentProfession) return gameTickResult;
    switch (villagerCopy.status) {
        case Status.WALKING_TO_TREE:
            if (targetObjectCopy) {
                villagerCopy.hitBox = getNewPosition(villagerCopy.hitBox, getHitBoxCenter(targetObjectCopy?.hitBox!));
                if (targetObjectCopy && onGoal(villagerCopy.hitBox, getHitBoxCenter(targetObjectCopy?.hitBox))) {
                    villagerCopy.status = Status.IDLE;
                }
            }
            else {
                villagerCopy.status = Status.IDLE;
            }
            break;
        case Status.CUTTING_TREE:
            if (inventoryIsFull(villagerCopy)) {
                villagerCopy.status = Status.IDLE;
                break;
            }

            if (targetObjectCopy) {
                if (treeHasWood(targetObjectCopy)) {
                    // Tree has wood
                    targetObjectCopy.inventory.find(x => x.resource.name === "Wood")!.amount = retract(targetObjectCopy.inventory.find(x => x.resource.name === "Wood")!.amount, 0.05);
                    mapObjectsCopy = mapObjectsCopy.map((tree) => {
                        if (tree.id === targetObjectCopy?.id) {
                            return targetObjectCopy;
                        }
                        return tree;
                    });
                    mapObjectsChanged = true;
                    let toAddResource = villagerCopy.inventoryItems.find(x => x.resource.name === 'Wood');
                    if (toAddResource) {
                        toAddResource.amount = add(toAddResource.amount, 0.05);
                        currentProfession.currentExperience = add(currentProfession.currentExperience, 1);
                        if(achievedNextLevel(currentProfession.currentExperience, currentProfession?.currentLevel.experienceNeededForNextLevel)) {
                            let nextLevel = levels.find(x => x.id === currentProfession?.currentLevel.nextLevel);
                            currentProfession.currentLevel = (nextLevel) ? nextLevel : currentProfession.currentLevel;
                            currentProfession.currentExperience = 0;
                        }
                    }
                    else {
                        villagerCopy.inventoryItems.push({ resource: resources.find(x => x.name === 'Wood')!, amount: 0 });
                    }
                }
                if (!treeHasWood(targetObjectCopy)) {
                    mapObjectsCopy = mapObjectsCopy.filter(x => x.id !== villagerCopy?.goalObjectId)
                    mapObjectsChanged = true;
                    villagerCopy.status = Status.IDLE;
                }
            }
            else {
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
            villagerCopy.inventoryItems.forEach(invItem => {
                if (inventoryItemsCopy) {
                    let inventoryResource = inventoryItemsCopy.find(x => x.resource.name === invItem.resource.name);
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
    villagersCopy = villagersCopy.map(vill => {
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

function achievedNextLevel(experience: number, experienceNeeded: number){
    return experience >= experienceNeeded;
}

function treeHasWood(tree: ObjectProps) {
    let woodOfTree = tree.inventory.find(x => x.resource.name === "Wood");
    if (tree.inventory && woodOfTree && woodOfTree.amount > 0) {
        return true;
    }
    return false;
}

function handleIdle(villager: VillagerProps, buildings: BuildingProps[], mapObjects: ObjectProps[], closestStorage: BuildingProps, targetObject?: ObjectProps) {
    if (!targetObject) {
        // find nearest tree and set target
        villager.goalObjectId = findNearestTree(getHitBoxCenter(villager.hitBox), mapObjects.filter(x => x.name === "tree"))?.id;
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
        }
        else {
            // Setting goal to nearest storage
            villager.status = Status.RETURNING_RESOURCES;
            // villager.goalObjectId = findNearestStorage(getHitBoxCenter(villager.hitBox), buildings).id;
        }
    }
    else {
        // Inventory leeg
        if (targetObject) {
            // Target is set
            if (onGoal(villager.hitBox, getHitBoxCenter(targetObject.hitBox))) {
                // On tree
                villager.status = Status.CUTTING_TREE;
            }
            else {
                // Walking to target
                villager.status = Status.WALKING_TO_TREE;
                villager.goalObjectId = targetObject.id;
            }
        }
        else {
            // geen target
            villager.status = Status.WALKING_TO_TREE;
            let nearestTree = findNearestTree(getHitBoxCenter(villager.hitBox), mapObjects.filter(x => x.name === "tree"));
            villager.goalObjectId = nearestTree.id;
        }
    }
    return villager;
}
