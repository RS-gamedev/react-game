import { Direction } from "../models/Direction";
import { Status } from "../models/enums/Status";
import { ObjectProps } from "../models/ObjectProps";
import { Position } from "../models/Position";
import { VillagerProps } from "../models/VillagerProps";

function getBestDirection(startPosition: { x: number, y: number }, goalPosition: { x: number, y: number }): Direction {
    let actualDistance = getDistance(startPosition, goalPosition);
    return Direction.up;
}


export function getDistance(startPosition: Position, goalPosition: Position) {
    let y = goalPosition.x - startPosition.x;
    let x = goalPosition.y - startPosition.y;
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
    villager.position = getNewPosition(villager.position, goalPosition);
    return villager;
}


export function findNearestTree(position: Position, trees: ObjectProps[]) {
    let closest: ObjectProps = trees[0];
    let lowestDistance = 10000;
    for (let tree of trees) {
        let distance = getDistance(position, tree.position);
        if (distance < lowestDistance) {
            closest = tree;
            lowestDistance = distance;
        }
    }

    // let goalPosition = { x: Math.floor(Math.random() * 800), y: Math.floor(Math.random() * 800) }; // nearest tree
    return closest;
}

export function moveVillagerToNearestRock(villager: VillagerProps) {
    let goalPosition = { x: 800, y: 800 };
    // goalposition = nearest rock
    return { ...villager, position: getNewPosition(villager.position, goalPosition) };
}

export function findNearestStorage(position: Position, storages: ObjectProps[]) {
    let closest: ObjectProps = storages[0];
    let lowestDistance = 10000;
    for (let storage of storages) {
        let distance = getDistance(position, storage.position);
        if (distance < lowestDistance) {
            closest = storage;
            lowestDistance = distance;
        }
    }

    return (closest) ? closest.position : {x: 0, y: 0};
}


export function reachedGoalPosition(position: Position, goalPosition: Position) {
    let actualDistance = getDistance(position, goalPosition);
    if (actualDistance < 30) return true;
    return false;
}