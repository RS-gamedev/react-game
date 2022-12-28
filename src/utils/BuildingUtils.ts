import { BuildingProps } from "../models/BuildingProps";
import { shapes } from "../config/Shapes";
import { Shape } from "../models/Shape";
import { v4 as uuidv4 } from "uuid";
import { BuildingType } from "../models/enums/BuildingType";
import { Position } from "../models/Position";
import { Hitbox } from "../models/Hitbox";

function constructBuilding(position: Position, shape: Shape, finished: boolean) {
  let hitbox = createHitbox(position, shape.size);
  let house: BuildingProps = {
    id: uuidv4(),
    selected: false,
    level: (finished) ? 1 : 0,
    name: shape.name,
    color: "#ffffff",
    icon: shape.icon,
    position: position,
    price: shape.price,
    size: shape.size,
    type: shape.type,
    image: shape.image,
    buildingOptions: shape.buildingOptions,
    hitBox: hitbox,
    inventory: shape.inventory.map(x => { return { ...x, amount: 100 } }),
    constructionPercentage: 0
  };
  return house;
}

export function createBuilding(position: Position, type: BuildingType, finished: boolean) {
  let shape = shapes.find((x) => x.type === type);
  if (!shape) return;
  return constructBuilding({ ...position, x: position.x, y: position.y }, shape, finished);
}

function createHitbox(position: Position, objectSize: { width: number; height: number }): Hitbox {
  return {
    leftTop: {
      x: position.x - objectSize.width / 2,
      y: position.y - objectSize.height / 2,
    },
    rightBottom: {
      x: position.x + objectSize.width / 2,
      y: position.y + objectSize.height / 2,
    },
  };
}
