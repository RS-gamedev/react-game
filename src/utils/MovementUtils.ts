import { BuildingProps } from "../models/BuildingProps";
import { Direction } from "../models/Direction";
import { Status } from "../models/enums/Status";
import { GameTickResult } from "../models/GameTickResult";
import { Hitbox } from "../models/Hitbox";
import { ObjectProps } from "../models/ObjectProps";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";
import { getHitBoxCenter, onGoal } from "./HitboxUtils";
import { getEmptyGameTickResultObject } from "./StatusUtils";

function getBestDirection(startPosition: { x: number, y: number }, goalPosition: { x: number, y: number }): Direction {
    let actualDistance = getDistance(startPosition, goalPosition);
    return Direction.up;
}


export function getDistance(startPosition: Position, goalPosition: Position) {
    let y = goalPosition.x - startPosition.x;
    let x = goalPosition.y - startPosition.y;
    return Math.sqrt(x * x + y * y);
}

export function getDistanceToHitBox(startPosition: Position, goalHitbox: Hitbox){
    let goalPosition = getHitBoxCenter(goalHitbox);
    let y = goalPosition.x - startPosition.x;
    let x = goalPosition.y - startPosition.y;
    return Math.sqrt(x * x + y * y);
}


export function getNewPosition(startPosition: Hitbox, goalPosition: Position): Hitbox{
    let newPosition: Hitbox = {...startPosition};
    let center = getHitBoxCenter(newPosition);
    if (goalPosition.x - center.x >= 10) {
        newPosition.leftTop.x += 8;
        newPosition.rightBottom.x += 8;
    }
    else if (goalPosition.x - center.x <= 10) {
        newPosition.leftTop.x -= 8;
        newPosition.rightBottom.x -= 8;
    }

    if (goalPosition.y - center.y >= 10) {
        newPosition.leftTop.y += 8;
        newPosition.rightBottom.y += 8;
    }
    else if (goalPosition.y - center.y <= 10) {
        newPosition.leftTop.y -= 8;
        newPosition.rightBottom.y -= 8;
    }
    return newPosition;
}

export function moveVillagerToPosition(villager: VillagerProps, goalPosition: Position) {
    villager.hitBox = getNewPosition(villager.hitBox, goalPosition);
    return villager;
}

export function moveVillagerToNearestRock(villager: VillagerProps) {
    let goalPosition = { x: 800, y: 800 };
    // goalposition = nearest rock
    return { ...villager, position: getNewPosition(villager.hitBox, goalPosition) };
}

export function findNearestStorage(position: Position, storages: BuildingProps[]) {
    let closest: BuildingProps = storages[0];
    let lowestDistance = 10000;
    for (let storage of storages) {
        let distance = getDistance({x: position.x, y: position.y}, {x: storage.position.x, y: storage.position.y});
        if (distance < lowestDistance) {
            closest = storage;
            lowestDistance = distance;
        }
    }
    return (closest) ? closest.position : {x: 0, y: 0};
}

export function doMoveToLocation(villagers: VillagerProps[], villagerId: string, goalPosition: Position): GameTickResult {
    let villagersCopy = [...villagers];
    let updatedVillager = villagersCopy.find( x=> x.id === villagerId);
    let gameTickResult: GameTickResult = getEmptyGameTickResultObject();

    if(updatedVillager){
        if (onGoal(updatedVillager.hitBox, goalPosition)) {
            updatedVillager.status = Status.IDLE;
            updatedVillager.currentTask = undefined;
        }
        else{
            updatedVillager = {...moveVillagerToPosition(updatedVillager, goalPosition)};
        }
        let villagersResult = gameTickResult.newState.find(x => x.name === 'villagers');

        if(!villagersResult) return gameTickResult;
        villagersResult.changed = true;
        villagersResult.stateObject = villagersCopy;
    }
    return gameTickResult;
}