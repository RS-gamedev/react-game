import { BuildingProps } from "./BuildingProps";
import { Inventory } from "./Inventory";
import { MapObjectProps } from "./MapObjectProps";
import { VillagerProps } from "./VillagerProps";

export type GameTickResult = {
  villagers: GameTickResultVillager[];
  buildings: GameTickResultBuilding[];
  mapObjects: GameTickResultMapObject[];
  inventory: GameTickResultInventory | undefined;
};

export type GameTickResultVillager = {
  villager: VillagerProps;
  updated: boolean;
};

export type GameTickResultMapObject = {
  mapObject: MapObjectProps;
  updated: boolean;
};

export type GameTickResultInventory = {
  inventory?: Inventory;
  updated: boolean;
};

export type GameTickResultBuilding = {
  building: BuildingProps;
  updated: boolean;
};
