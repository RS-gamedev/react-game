import { resources } from "../config/Resources";
import { shapes } from "../config/Shapes";
import { BuildingProps } from "../models/BuildingProps";
import { BuildingType } from "../models/enums/BuildingType";
import { Inventory } from "../models/Inventory";
import { ObjectProps } from "../models/ObjectProps";
import { v4 as uuidv4 } from "uuid";
import { createBuilding } from "./BuildingUtils";
import { Hitbox } from "../models/Hitbox";

export function setInitialInventory() {
  let wood = resources.find((x) => x.name === "Wood");
  let coins = resources.find((x) => x.name === "Coins");
  let gems = resources.find((x) => x.name === "Gems");
  let food = resources.find((x) => x.name === "Food");
  let stone = resources.find((x) => x.name === "Stone");

  if (!wood || !coins || !gems || !food || !stone) return;
  let inventoryInit: Inventory = {
    resources: [
      {
        resource: coins,
        amount: 50,
      },
      {
        resource: wood,
        amount: 100,
      },
      {
        resource: gems,
        amount: 0,
      },
      {
        resource: food,
        amount: 0,
      },
      {
        resource: stone,
        amount: 0,
      },
    ],
  };
  return inventoryInit;
}

export function setInitialBuildings() {
  let townCenter = shapes.find((x) => x.type === BuildingType.TOWN_CENTER);
  if (townCenter) {
    let initialBuildings: BuildingProps[] = [createBuilding({ x: 500, y: 300 }, BuildingType.TOWN_CENTER)!];
    if (initialBuildings) {
      return initialBuildings;
    }
  }
  return [];
}

export function setInitialMapObjects(map: any): ObjectProps[] {
  let wood = resources.find((x) => x.name === "Wood");
  let coins = resources.find((x) => x.name === "Coins");
  let gems = resources.find((x) => x.name === "Gems");
  let stone = resources.find((x) => x.name === "Stone");
  let initialMapObjects: ObjectProps[] = map.map.map((mapObject: any) => {
    let hitBox: Hitbox = {
      leftTop: {
        x: mapObject.position.x - mapObject.size / 2,
        y: mapObject.position.y - mapObject.size / 2,
      },
      rightBottom: {
        x: mapObject.position.x + mapObject.size / 2,
        y: mapObject.position.y + mapObject.size / 2,
      },
    };
    let mapObjectInventory = [
      {
        resource: mapObject.name === "tree" ? wood : mapObject.name === "rock" && stone,
        amount: 50,
      },
    ];
    return {
      id: uuidv4(),
      name: mapObject.name,
      position: mapObject.position,
      selected: false,
      hitBox: hitBox,
      size: mapObject.size,
      inventory: mapObjectInventory,
    };
  });
  return initialMapObjects;
}
