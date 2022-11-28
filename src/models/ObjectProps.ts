import { BuildingOption } from "./BuildingOption";
import { VillagerType } from "./enums/VillagerType";
import { Hitbox } from "./Hitbox";
import { InventoryItem } from "./InventoryItem";

export type ObjectProps = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  name: string;
  selected: boolean;
  buildingOptions: BuildingOption[];
  hitBox: Hitbox;
  type: VillagerType;
  inventory: InventoryItem[];
  inventoryMax: number;
  size: {
    height: string;
    width: string;
  };
};
