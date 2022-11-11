import { Direction } from "../models/Direction";
import { Status } from "../models/enums/Status";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";

function getBestDirection(startPosition: { x: number, y: number }, goalPosition: { x: number, y: number }): Direction {
    let actualDistance = getDistance(startPosition.x, startPosition.y, goalPosition.x, goalPosition.y);
    return Direction.up;
}


function getDistance(x1: number, y1: number, x2: number, y2: number) {
    let y = x2 - x1;
    let x = y2 - y1;
    return Math.sqrt(x * x + y * y);
}


export function getNewPosition(startPosition: { x: number, y: number }, goalPosition: { x: number, y: number }) {
    let newPosition = { x: startPosition.x, y: startPosition.y };
    if (goalPosition.x - startPosition.x > 10) {
        newPosition.x += 10;
    }
    else if (goalPosition.x - startPosition.x < 10) {
        newPosition.x -= 10;
    }

    if (goalPosition.y - startPosition.y > 10) {
        newPosition.y += 10;
    }
    else if (goalPosition.y - startPosition.y < 10) {
        newPosition.y -= 10;
    }
    return newPosition;
}

export function moveVillagerToPosition(villager: VillagerProps, goalPosition: Position) {
    // goalposition = nearest tree
    return { ...villager, position: getNewPosition(villager.position, goalPosition) };
}


export function findNearestTree(position: Position){
    let goalPosition = { x: Math.floor(Math.random() * 800), y: Math.floor(Math.random() * 800) }; // nearest tree
    return goalPosition;

}

export function moveVillagerToNearestRock(villager: VillagerProps) {
    let goalPosition = { x: 800, y: 800 };
    // goalposition = nearest rock
    return { ...villager, position: getNewPosition(villager.position, goalPosition) };
}

export function findNearestStorage(position: Position){
    let goalPosition = { x: 200, y: 200 }; // nearest tree
    return goalPosition;
}


export function reachedGoalPosition(position: Position, goalPosition: Position){
    let actualDistance = getDistance(position.x, position.y, goalPosition.x, goalPosition.y);
    if(actualDistance < 21) return true;
    return false;

}