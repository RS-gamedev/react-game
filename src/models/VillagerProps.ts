import { BuildingElementType } from "./Building";
import { BuildingOption } from "./BuildingOption";
import { Status } from "./enums/Status";
import { GameTickResult } from "./GameTickResult";
import { Hitbox } from "./Hitbox";
import { InventoryItem } from "./InventoryItem";
import { Position } from "./Position";
import { Price } from "./Price";
import { VillagerProfession } from "./VillagerProfession";

export type VillagerProps = {
  id: string;
  name: string;
  status: Status;
  goalObjectId?: string;
  inventorySlots: number;
  inventoryItems: InventoryItem[];
  price: Price[];
  selected: boolean;
  currentTask?: (
    villagers: VillagerProps[],
    villagerId: string,
    inventoryItems: InventoryItem[],
    buildings: BuildingElementType[],
    mapObjects: BuildingElementType[],
    goalPosition?: Position
  ) => GameTickResult;
  buildingOptions: BuildingOption[];
  hitBox: Hitbox;
  size: { width: number; height: number };
  professions: VillagerProfession[];
};
