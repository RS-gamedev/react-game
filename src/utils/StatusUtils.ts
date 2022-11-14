import { resources } from "../config/Resources";
import { BuildingProps } from "../models/BuildingProps";
import { BuildingType } from "../models/enums/BuildingType";
import { Status } from "../models/enums/Status";
import { Inventory } from "../models/Inventory";
import { ObjectProps } from "../models/ObjectProps";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { getStorageBuildings } from "./BuildingUtils";
import { findNearestStorage, findNearestTree, getDistance, moveVillagerToPosition, reachedGoalPosition } from "./MovementUtils";

export function doWoodcutting(villager: VillagerProps, inventory: Inventory, buildings: BuildingProps[], mapObjects: ObjectProps[]) {
    if (villager.status === Status.IDLE) {
        villager = handleIdle(villager, buildings, mapObjects);
    }
    switch (villager.status) {
        case Status.WALKING_TO_TREE:
            if (villager.goalPosition) {
                let movedVillager = moveVillagerToPosition(villager, villager.goalPosition);
                if (movedVillager.goalPosition && reachedGoalPosition(movedVillager.position, movedVillager.goalPosition)) {
                    movedVillager.status = Status.IDLE;
                    return movedVillager;
                }
                return movedVillager;
            }
            return villager;
        case Status.CUTTING_TREE:
            if (villager.inventoryItems[0] && villager.inventoryItems[0].amount >= villager.inventorySlots) {
                villager.status = Status.IDLE;
                return villager;
            }
            let toAddResource = villager.inventoryItems.find(x => x.resource.name == 'Wood');
            if (toAddResource && toAddResource) {
                toAddResource.amount = toAddResource.amount + 0.05;
            }
            else {
                villager.inventoryItems.push({ resource: resources.find(x => x.name == 'Wood')!, amount: 0 });
            }
            return villager;
        case Status.RETURNING_RESOURCES:
            if (villager.goalPosition) {
                let movedVillager = moveVillagerToPosition(villager, villager.goalPosition);
                if (movedVillager.goalPosition && reachedGoalPosition(movedVillager.position, movedVillager.goalPosition)) {
                    movedVillager.status = Status.IDLE;
                    return movedVillager;
                }
                return movedVillager;
            }
            return villager;
        case Status.DROPPING_RESOURCES:
            villager.inventoryItems.forEach(invItem => {
                
                if (inventory && inventory.resources) {
                    let invCopyItemsCopy = [...inventory.resources];
                    let inventoryResource = invCopyItemsCopy.find(x => x.resource.name == invItem.resource.name);
                    if (inventoryResource) {
                        inventoryResource.amount! += invItem.amount;
                        invItem.amount = 0;
                        inventory.resources = invCopyItemsCopy;
                        villager.status = Status.IDLE;
                    }
                }
            });
            return villager;
        default:
            return villager;
    }
}

function inventoryIsFull(villager: VillagerProps): boolean {
    if(villager.inventoryItems[0] && villager.inventoryItems[0].amount >= villager.inventorySlots){
        return true;
    }
    return false;
}

function onTree(villager: VillagerProps, treeLocations: ObjectProps[]): boolean {
    let distanceToNearestTree = getDistance(villager.position, findNearestTree(villager.position, treeLocations));
    if (distanceToNearestTree && distanceToNearestTree < 25) return true;
    return false;
}
function onStorage(villager: VillagerProps, storageLocations: BuildingProps[]) {
    let distanceToNearestStorage = getDistance(villager.position, findNearestStorage(villager.position, storageLocations));
    if (distanceToNearestStorage && distanceToNearestStorage < 25) return true;
    return false;
}

function handleIdle(villager: VillagerProps, buildings: BuildingProps[], mapObjects: ObjectProps[]) {
    if (inventoryIsFull(villager)) {
        //Inventory vol
        if (onStorage(villager, buildings.filter(x => x.type === BuildingType.TENTS || x.type === BuildingType.TOWN_CENTER || x.type === BuildingType.STORAGE))) {
            villager.status = Status.DROPPING_RESOURCES;
        }
        else {
            villager.status = Status.RETURNING_RESOURCES;
            villager.goalPosition = findNearestStorage(villager.position, buildings);
        }
    }
    else {
        // Inventory leegfconso
        if (onTree(villager, mapObjects.filter(x => x.name === 'tree'))) {
            villager.status = Status.CUTTING_TREE;
        }
        else {
            villager.status = Status.WALKING_TO_TREE;
            villager.goalPosition = findNearestTree(villager.position, mapObjects);
        }
    }
    return villager;
}


export function moveToLocation(villager: VillagerProps, goalPosition: Position): VillagerProps {
    let newVillager = moveVillagerToPosition(villager, goalPosition);
    newVillager.status = Status.WALKING;
    if(reachedGoalPosition(newVillager.position, goalPosition)){
        villager.status = Status.IDLE;
        villager.currentTask =  undefined;
    }
    return newVillager;
}
