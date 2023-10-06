import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Price } from "./Price";
import { BuyOptionIdentifier } from "../config/BuyOptions";

export type BuyOption = {
  id: string;
  price?: Price[];
  icon?: IconProp;
  name: string;
  // toExecute: (position: Position) => any;
  imageName: string;
  type: BuyOptionIdentifier;
  shapeId?: string;
  placementRange?: number;
};
