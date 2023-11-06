import { BuildingProps } from "./BuildingProps";
import { Inventory } from "./Inventory";
import { MapObjectProps } from "./MapObjectProps";
import { VillagerProps } from "./VillagerProps";

export type GameTickResult = {
  villagers: VillagerProps[];
  buildings: BuildingProps[];
  mapObjects: MapObjectProps[];
  inventory: Inventory | undefined;
};
