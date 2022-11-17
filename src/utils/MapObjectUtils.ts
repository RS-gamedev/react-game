import { BuildingProps } from "../models/BuildingProps";
import { ObjectProps } from "../models/ObjectProps";
import { Position } from "../models/Position";
import { onGoal } from "./HitboxUtils";
import { getDistance } from "./MovementUtils";

export function setSelectedMapObject(mapObjects: ObjectProps[], toSelect: ObjectProps){
    let mapObjectsCopy = [...mapObjects];
    let selectedMapObject = mapObjectsCopy.find(x => x.id === toSelect.id);
    if (selectedMapObject) {
        selectedMapObject.selected = true;
    }
    mapObjectsCopy.filter(x => x.id !== toSelect.id).forEach(x => x.selected = false);
    return mapObjectsCopy;
}

export function deselectAllMapObjects(mapObjects: ObjectProps[]){
    let mapObjectsCopy = [...mapObjects];
    mapObjectsCopy.forEach(x => x.selected = false);
    return mapObjectsCopy;
}

export function getStorageOnPosition(storages: BuildingProps[], goalPosition: Position | undefined) {
    if (!goalPosition) return undefined;
    let storage = storages.find(x => onGoal(x.hitBox, goalPosition));
    return storage;
}


export function findNearestTree(position: Position, trees: ObjectProps[]) {
    let closest: ObjectProps = trees[0];
    let lowestDistance = 10000;
    for (let tree of trees) {
        let distance = getDistance({x: position.x, y: position.y}, {x: tree.position.x , y: tree.position.y });
        if (distance < lowestDistance) {
            closest = tree;
            lowestDistance = distance;
        }
    }
    return closest;
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
    return closest
}
