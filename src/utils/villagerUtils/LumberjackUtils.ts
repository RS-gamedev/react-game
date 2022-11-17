import { resources } from "../../config/Resources";
import { BuildingProps } from "../../models/BuildingProps";
import { BuildingType } from "../../models/enums/BuildingType";
import { Status } from "../../models/enums/Status";
import { GameTickResult } from "../../models/GameTickResult";
import { Inventory } from "../../models/Inventory";
import { ObjectProps } from "../../models/ObjectProps";
import { VillagerProps } from "../../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "../HitboxUtils";
import { findNearestStorage, findNearestTree, getStorageOnPosition } from "../MapObjectUtils";
import { moveVillagerToPosition } from "../MovementUtils";
import { getEmptyGameTickResultObject } from "../StatusUtils";
import { inventoryIsFull } from "../VillagerUtils";

export function doWoodcutting(villagers: VillagerProps[], villagerId: string, inventory: Inventory, buildings: BuildingProps[], mapObjects: ObjectProps[], initialTargetId: string): GameTickResult {
    let villagersCopy = [...villagers];
    let villagerCopy = villagersCopy.find(x => x.id === villagerId);
    let inventoryCopy = { ...inventory };
    let mapObjectsCopy = [...mapObjects];
    let targetObjectCopy = mapObjectsCopy.find(x => x.id === initialTargetId);
    if (!targetObjectCopy) {
        // if initial target is not found, set target to villagerCopy.goalObjectId;
        targetObjectCopy = mapObjectsCopy.find(x => x.id === villagerCopy?.goalObjectId);
    }
    let gameTickResult: GameTickResult = getEmptyGameTickResultObject();
    let mapObjectsChanged: boolean = false;
    if (!villagerCopy) return gameTickResult;
    let closestStorage = findNearestStorage(getHitBoxCenter(villagerCopy?.hitBox), buildings.filter(x => x.type === BuildingType.TOWN_CENTER))

    villagerCopy = handleIdle(villagerCopy, buildings, mapObjectsCopy, closestStorage, targetObjectCopy);

    switch (villagerCopy.status) {
        case Status.WALKING_TO_TREE:
            if (villagerCopy.goalPosition) {
                let movedVillager = moveVillagerToPosition(villagerCopy, getHitBoxCenter(targetObjectCopy?.hitBox!));
                if (targetObjectCopy && onGoal(movedVillager.hitBox, getHitBoxCenter(targetObjectCopy?.hitBox))) {
                    movedVillager.status = Status.IDLE;
                    villagerCopy = movedVillager;
                }
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
                    }
                    else {
                        villagerCopy.inventoryItems.push({ resource: resources.find(x => x.name === 'Wood')!, amount: 0 });
                    }
                }
                if (!treeHasWood(targetObjectCopy)) {
                    mapObjectsCopy = mapObjectsCopy.filter(x => x.id !== villagerCopy?.goalObjectId)
                    mapObjectsChanged = true;
                    villagerCopy.status = Status.IDLE;
                    villagerCopy.goalObjectId = findNearestTree(getHitBoxCenter(villagerCopy.hitBox), mapObjectsCopy.filter(x => x.name === "tree")).id;
                }
            }

            break;
        case Status.RETURNING_RESOURCES:
            let movedVillager = moveVillagerToPosition(villagerCopy, closestStorage.position);
            if (onGoal(movedVillager.hitBox, closestStorage.position)) {
                movedVillager.status = Status.IDLE;
                villagerCopy = movedVillager;
            }
            break;
        case Status.DROPPING_RESOURCES:
            let invCopyItemsCopy = [...inventoryCopy.resources];
            villagerCopy.inventoryItems.forEach(invItem => {
                if (inventoryCopy && invCopyItemsCopy) {
                    let inventoryResource = invCopyItemsCopy.find(x => x.resource.name == invItem.resource.name);
                    if (inventoryResource) {
                        inventoryResource.amount! += invItem.amount;
                        invItem.amount = 0;
                        inventoryCopy.resources = invCopyItemsCopy;
                    }
                }
                villagerCopy!.status = Status.IDLE;
            });
            gameTickResult.inventory = inventoryCopy;
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

    gameTickResult.villagers = villagersCopy;
    return gameTickResult;
}

function add(start: number, by: number): number {
    return ((start * 10) + (by * 10)) / 10;
}

function retract(start: number, by: number) {
    return ((start * 10) - (by * 10)) / 10;
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
        console.log("No target");

        villager.currentTask = undefined;
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
                villager.goalPosition = getHitBoxCenter(targetObject.hitBox);
                villager.goalObjectId = targetObject.id;
            }
        }
        else {
            // geen target
            villager.status = Status.WALKING_TO_TREE;
            let nearestTree = findNearestTree(getHitBoxCenter(villager.hitBox), mapObjects.filter(x => x.name === "tree"));
            villager.goalPosition = nearestTree.position;
            villager.goalObjectId = nearestTree.id;
        }
    }
    return villager;
}
