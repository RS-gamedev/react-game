import { resources } from "../config/Resources";
import { BuildingProps } from "../models/BuildingProps";
import { BuildingType } from "../models/enums/BuildingType";
import { Status } from "../models/enums/Status";
import { Hitbox } from "../models/Hitbox";
import { Inventory } from "../models/Inventory";
import { ObjectProps } from "../models/ObjectProps";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { findNearestStorage, findNearestTree, getDistance, getDistanceToHitBox, moveVillagerToPosition } from "./MovementUtils";

export function doWoodcutting(villager: VillagerProps, invent: [inventory: Inventory, setInventory: React.Dispatch<React.SetStateAction<Inventory>>], buildings: BuildingProps[], mapObjects: ObjectProps[], objectHitbox: Hitbox) {
    if (villager.status === Status.IDLE || villager.status === Status.WALKING) {
        villager = handleIdle(villager, buildings, mapObjects, objectHitbox);
    }
    switch (villager.status) {
        case Status.WALKING_TO_TREE:
            if (villager.goalPosition) {
                let movedVillager = moveVillagerToPosition(villager, villager.goalPosition);
                if (movedVillager.goalPosition && onGoal(movedVillager.hitBox, movedVillager.goalPosition)) {
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
                if (movedVillager.goalPosition && onGoal(movedVillager.hitBox, movedVillager.goalPosition)) {
                    movedVillager.status = Status.IDLE;
                    return movedVillager;
                }
                return movedVillager;
            }
            return villager;
        case Status.DROPPING_RESOURCES:
            villager.inventoryItems.forEach(invItem => {
                if (invent && invent[0].resources) {
                    let inventoryCopy = { ...invent[0] };
                    let invCopyItemsCopy = [...inventoryCopy.resources];
                    let inventoryResource = invCopyItemsCopy.find(x => x.resource.name == invItem.resource.name);
                    if (inventoryResource) {
                        inventoryResource.amount! += invItem.amount;
                        invItem.amount = 0;
                        inventoryCopy.resources = invCopyItemsCopy;
                        invent[1](inventoryCopy);
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
    if (villager.inventoryItems[0] && villager.inventoryItems[0].amount >= villager.inventorySlots) {
        return true;
    }
    return false;
}
function getStorageOnPosition(storages: BuildingProps[], goalPosition: Position | undefined) {
    if (!goalPosition) return undefined;
    let storage = storages.find(x => onGoal(x.hitBox, goalPosition));
    return storage;
}

function isOnHitBox(hitBox1: Hitbox, hitbox2: Hitbox): boolean {
    let hitboxCenterPoint: Position = getHitBoxCenter(hitBox1);
    if ((hitboxCenterPoint.x > hitbox2.leftTop.x && hitboxCenterPoint.x < hitbox2.rightBottom.x) && (hitboxCenterPoint.y > hitbox2.leftTop.y && hitboxCenterPoint.y < hitbox2.rightBottom.y)) return true;
    return false;
}

export function getHitBoxCenter(hitbox: Hitbox): Position {
    return {
        x: hitbox.rightBottom.x - ((hitbox.rightBottom.x - hitbox.leftTop.x) / 2),
        y: hitbox.rightBottom.y - ((hitbox.rightBottom.y - hitbox.leftTop.y) /2)
    };
}

export function onGoal(hitbox: Hitbox, goalPosition?: Position) {
    if (!goalPosition) return false;
    if ((goalPosition.x > hitbox.leftTop.x && goalPosition.x < hitbox.rightBottom.x) && (goalPosition.y > hitbox.leftTop.y && goalPosition.y < hitbox.rightBottom.y)) return true;
    return false;
}

function handleIdle(villager: VillagerProps, buildings: BuildingProps[], mapObjects: ObjectProps[], objectHitbox: Hitbox) {
    if (inventoryIsFull(villager)) {
        //Inventory vol
        if (onGoal(villager.hitBox, getStorageOnPosition(buildings.filter(x => x.type === BuildingType.TOWN_CENTER), villager.goalPosition)?.position)) {
            villager.status = Status.DROPPING_RESOURCES;
        }
        else {
            villager.status = Status.RETURNING_RESOURCES;
            villager.goalPosition = findNearestStorage(getHitBoxCenter(villager.hitBox), buildings);
        }
    }
    else {
        // Inventory leeg
        if (objectHitbox) {
            // Target is set
            if (onGoal(villager.hitBox, getHitBoxCenter(objectHitbox))) {
                villager.status = Status.CUTTING_TREE;
            }
            else {
                villager.goalPosition = getHitBoxCenter(objectHitbox);
                villager.status = Status.WALKING_TO_TREE;
            }
        }
        else {
            // geen target
            villager.status = Status.WALKING_TO_TREE;
            villager.goalPosition = findNearestTree(getHitBoxCenter(villager.hitBox), mapObjects).position;
        }
    }
    return villager;
}


export function moveToLocation(villager: VillagerProps, goalPosition: Position): VillagerProps {
    let newVillager = moveVillagerToPosition(villager, goalPosition);
    newVillager.status = Status.WALKING;
    if (onGoal(newVillager.hitBox, goalPosition)) {
        villager.status = Status.IDLE;
        villager.currentTask = undefined;
    }
    return newVillager;
}
