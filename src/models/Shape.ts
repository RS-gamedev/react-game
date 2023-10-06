import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { BuyOption } from "./BuyOption";
import { Availability } from "./enums/Availability";
import { BuildingType } from "./enums/BuildingType";
import { InventoryItem } from "./InventoryItem";
import { Price } from "./Price";

export type Shape = {
  id: string;
  name: string;
  icon?: IconProp;
  iconColor?: string;
  image: string;
  selected?: boolean;
  price: Price[];
  type: BuildingType;
  size: { width: number; height: number };
  buyOptions: BuyOption[];
  availability: Availability;
  inventory: InventoryItem[];
};
