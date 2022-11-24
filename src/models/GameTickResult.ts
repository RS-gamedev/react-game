import { BuildingProps } from "./BuildingProps";
import { InventoryItem } from "./InventoryItem";
import { ObjectProps } from "./ObjectProps";
import { VillagerProps } from "./VillagerProps";

export type GameTickResult = {
  villagers: VillagerProps[] | undefined;
  buildings: BuildingProps[] | undefined;
  mapObjects: ObjectProps[] | undefined;
  inventoryItems: InventoryItem[] | undefined;
};
