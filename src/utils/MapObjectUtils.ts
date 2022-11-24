import { BuildingProps } from "../models/BuildingProps";
import { Position } from "../models/Position";
import { getDistance } from "./MovementUtils";

export function findNearestStorage(position: Position, storages: BuildingProps[]) {
  let closest: BuildingProps = storages[0];
  let lowestDistance = 10000;
  for (let storage of storages) {
    let distance = getDistance({ x: position.x, y: position.y }, { x: storage.position.x, y: storage.position.y });
    if (distance < lowestDistance) {
      closest = storage;
      lowestDistance = distance;
    }
  }
  return closest;
}
