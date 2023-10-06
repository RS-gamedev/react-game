import { EntityElementType } from "./EntityElementType";
import { InventoryItem } from "./InventoryItem";

export type GameTickResult = {
  villagers: EntityElementType[] | undefined;
  buildings: EntityElementType[] | undefined;
  mapObjects: EntityElementType[] | undefined;
  inventoryItems: InventoryItem[] | undefined;
};
