import { EntityElementType } from "./EntityElementType";
import { InventoryItem } from "./InventoryItem";
import { VillagerProps } from "./VillagerProps";

export type GameTickResult = {
  villagers: VillagerProps[] | undefined;
  buildings: EntityElementType[] | undefined;
  mapObjects: EntityElementType[] | undefined;
  inventoryItems: InventoryItem[] | undefined;
};
