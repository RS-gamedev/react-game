import { v4 as uuidv4 } from "uuid";
import { resources } from "../config/Resources";
import { Hitbox } from "../models/Hitbox";
import { Inventory } from "../models/Inventory";
import { MapPickerObject } from "../models/MapPickerObject";
import { MapObjectProps } from "../models/MapObjectProps";
import { VillagerType } from "../models/enums/VillagerType";

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

export function setInitialMapObjects(map: MapPickerObject[]): MapObjectProps[] | undefined {
  let wood = resources.find((x) => x.name === "Wood");
  let stone = resources.find((x) => x.name === "Stone");
  if (!wood || !stone) return undefined;
  let initialMapObjects: MapObjectProps[] = map.map((mapObject: MapPickerObject) => {
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
      size: { width: mapObject.size || 0, height: mapObject.size || 0 },
      buyOptions: [],
      type: VillagerType.VILLAGER,
      inventory: mapObjectInventory,
      inventoryMax: amount,
    };
  });
  return initialMapObjects;
}
