import { resources } from "../../config/Resources";
import { BuildingProps } from "../../models/BuildingProps";
import { BuildingType } from "../../models/enums/BuildingType";
import { Status } from "../../models/enums/Status";
import { GameTickResult } from "../../models/GameTickResult";
import { Inventory } from "../../models/Inventory";
import { ObjectProps } from "../../models/ObjectProps";
import { VillagerProps } from "../../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "../HitboxUtils";
import { findNearestTree, getStorageOnPosition } from "../MapObjectUtils";
import { findNearestStorage, moveVillagerToPosition } from "../MovementUtils";
import { getEmptyGameTickResultObject } from "../StatusUtils";
import { inventoryIsFull } from "../VillagerUtils";

export function doWoodcutting(villagers: VillagerProps[], villagerId: string, inventory: Inventory, buildings: BuildingProps[],  mapObjects: ObjectProps[], targetObject: ObjectProps): GameTickResult {
    let villagersCopy = [...villagers];
    let villagerCopy = villagersCopy.find(x => x.id === villagerId);
    let inventoryCopy = {...inventory};
    let mapObjectsCopy = {...mapObjects};
    let gameTickResult: GameTickResult = getEmptyGameTickResultObject();

    let villagersResult = gameTickResult.newState.find(x => x.name === 'villagers');
    let inventoryResult = gameTickResult.newState.find(x => x.name === 'inventory');

    if(!villagersResult || !inventoryResult || !villagerCopy) return gameTickResult;

    if (villagerCopy.status === Status.IDLE || villagerCopy.status === Status.WALKING) {
        villagerCopy = handleIdle(villagerCopy, buildings, mapObjectsCopy, targetObject);
    }
    switch (villagerCopy.status) {
        case Status.WALKING_TO_TREE:
            if (villagerCopy.goalPosition) {
                let movedVillager = moveVillagerToPosition(villagerCopy, villagerCopy.goalPosition);
                if (movedVillager.goalPosition && onGoal(movedVillager.hitBox, movedVillager.goalPosition)) {
                    movedVillager.status = Status.IDLE;
                    villagerCopy =  movedVillager;
                }
            }
            break;
        case Status.CUTTING_TREE:
            if (villagerCopy.inventoryItems[0] && villagerCopy.inventoryItems[0].amount >= villagerCopy.inventorySlots) {
                villagerCopy.status = Status.IDLE;
                break;
            }

            let mapObjectCopy = {...villagerCopy.goalObject};
            if(mapObjectCopy && mapObjectCopy.inventory){
                let mapObjectsWoodResource = mapObjectCopy.inventory.find(x => x.resource.name === "Wood");
                if(mapObjectsWoodResource){
                    if(mapObjectsWoodResource.amount - 0.05 >= 0){
                        mapObjectsWoodResource.amount -= 0.05;
                    }
                    else{
                        villagerCopy.status = Status.IDLE;
                    }
                }
            }

            let toAddResource = villagerCopy.inventoryItems.find(x => x.resource.name === 'Wood');
            if (toAddResource && toAddResource) {
                toAddResource.amount = toAddResource.amount + 0.05;
            }
            else {
                villagerCopy.inventoryItems.push({ resource: resources.find(x => x.name === 'Wood')!, amount: 0 });
            }
            break;
        case Status.RETURNING_RESOURCES:
            if (villagerCopy.goalPosition) {
                let movedVillager = moveVillagerToPosition(villagerCopy, villagerCopy.goalPosition);
                if (movedVillager.goalPosition && onGoal(movedVillager.hitBox, movedVillager.goalPosition)) {
                    movedVillager.status = Status.IDLE;
                    villagerCopy =  movedVillager;
                }
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
            inventoryResult.changed = true;
            inventoryResult.stateObject = inventoryCopy;
            break;
        default:
            break;
    }

    villagersResult.changed = true;
    villagersCopy = villagersCopy.map(vill => {
        if(villagerCopy && vill.id === villagerCopy.id){
            return villagerCopy;
        }
        return vill;
    })
    villagersResult.stateObject = villagersCopy;
    return gameTickResult;
}

function handleIdle(villager: VillagerProps, buildings: BuildingProps[], mapObjects: ObjectProps[], targetObject: ObjectProps) {
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
        if (targetObject) {
            // Target is set
            if (onGoal(villager.hitBox, getHitBoxCenter(targetObject.hitBox))) {
                villager.status = Status.CUTTING_TREE;
            }
            else {
                villager.status = Status.WALKING_TO_TREE;
                villager.goalPosition = getHitBoxCenter(targetObject.hitBox);
                villager.goalObject = targetObject;
            }
        }
        else {
            // geen target
            villager.status = Status.WALKING_TO_TREE;
            let nearestTree = findNearestTree(getHitBoxCenter(villager.hitBox), mapObjects);
            villager.goalPosition = nearestTree.position;
            villager.goalObject = nearestTree;
        }
    }
    return villager;
}
