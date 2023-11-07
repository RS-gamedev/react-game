import { EntityElementType } from "./EntityElementType";
import { BuyOption } from "./BuyOption";
import { Status } from "./enums/Status";
import { GameTickResult } from "./GameTickResult";
import { Hitbox } from "./Hitbox";
import { InventoryItem } from "./InventoryItem";
import { Position } from "./Position";
import { Price } from "./Price";
import { VillagerProfession } from "./VillagerProfession";
import { Inventory } from "./Inventory";
import { BuildingProps } from "./BuildingProps";
import { MapObjectProps } from "./MapObjectProps";

export type VillagerProps = {
  id: string;
  name: string;
  status: Status;
  goalObjectId?: string;
  inventorySlots: number;
  inventoryItems: InventoryItem[];
  price: Price[];
  selected: boolean;
  currentAction?: (Villagers: VillagerProps[], villagerId: string, inventory: Inventory, buildings: BuildingProps[], mapObjects: MapObjectProps[], gameTickResult: GameTickResult) => GameTickResult;
  buyOptions: BuyOption[];
  hitBox: Hitbox;
  size: { width: number; height: number };
  professions: VillagerProfession[];
};
