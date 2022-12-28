import { resources } from "../config/Resources";
import { shapes } from "../config/Shapes";
import { BuildingProps } from "../models/BuildingProps";
import { BuildingType } from "../models/enums/BuildingType";
import { Inventory } from "../models/Inventory";
import { ObjectProps } from "../models/ObjectProps";
import { v4 as uuidv4 } from "uuid";
import { createBuilding } from "./BuildingUtils";
import { Hitbox } from "../models/Hitbox";
import { MapPickerObject } from "../models/MapPickerObject";
import { VillagerType } from "../models/enums/VillagerType";
import { Position } from "../models/Position";

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
        amount: 0,
      },
      {
        resource: wood,
        amount: 250,
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

export function setInitialBuildings(position: Position) {
  let townCenter = shapes.find((x) => x.type === BuildingType.TOWN_CENTER);
  if (townCenter) {
    let initialBuildings: BuildingProps[] = [createBuilding({ x: position.x, y: position.y }, BuildingType.TOWN_CENTER)!];
    if (initialBuildings) {
      return initialBuildings;
    }
  }
  return [];
}

export function setInitialMapObjects(map: MapPickerObject[]): ObjectProps[] | undefined {
  let wood = resources.find((x) => x.name === "Wood");
  // let coins = resources.find((x) => x.name === "Coins");
  // let gems = resources.find((x) => x.name === "Gems");
  let stone = resources.find((x) => x.name === "Stone");
  if (!wood || !stone) return undefined;
  let initialMapObjects: ObjectProps[] = map.map((mapObject: MapPickerObject) => {
    let hitBox: Hitbox = {
      leftTop: {
        x: mapObject.position!.x - mapObject.size! / 2,
        y: mapObject.position!.y - mapObject.size! / 2,
      },
      rightBottom: {
        x: mapObject.position!.x + mapObject.size! / 2,
        y: mapObject.position!.y + mapObject.size! / 2,
      },
    };
    let resource = mapObject.name === "tree" ? wood : mapObject.name === "rock" ? stone : wood;
    let amount = 50;
    let mapObjectInventory = [
      {
        resource: resource!,
        amount: amount,
      },
    ];
    return {
      id: uuidv4(),
      name: mapObject.name,
      position: mapObject.position!,
      selected: false,
      hitBox: hitBox,
      size: { width: mapObject.size + "px", height: mapObject.size + "px" },
      buildingOptions: [],
      type: VillagerType.VILLAGER,
      inventory: mapObjectInventory,
      inventoryMax: amount
    };
  });
  return initialMapObjects;
}
