import { BuildingElementType } from "./Building";
import { BuildingProps } from "./BuildingProps";
import { InventoryItem } from "./InventoryItem";
import { ObjectProps } from "./ObjectProps";
import { VillagerProps } from "./VillagerProps";

export type GameTickResult = {
  villagers: VillagerProps[] | undefined;
  buildings: BuildingElementType[] | undefined;
  mapObjects: BuildingElementType[] | undefined;
  inventoryItems: InventoryItem[] | undefined;
};
