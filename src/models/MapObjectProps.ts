import { BuyOption } from "./BuyOption";
import { VillagerType } from "./enums/VillagerType";
import { Hitbox } from "./Hitbox";
import { InventoryItem } from "./InventoryItem";
import { Size } from "./Size";

export type MapObjectProps = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  name: string;
  buyOptions: BuyOption[];
  hitBox: Hitbox;
  type: VillagerType;
  inventory: InventoryItem[];
  inventoryMax: number;
  size: Size;
};
