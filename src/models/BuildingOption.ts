import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { BuildingOptionType } from "./enums/BuildingOptionType";
import { Position } from "./Position";
import { Price } from "./Price";
import { Shape } from "./Shape";

export type BuildingOption = {
  id: string;
  price?: Price[];
  icon?: IconProp;
  name: string;
  toExecute: (position: Position) => any;
  imageName: string;
  type: BuildingOptionType;
  shapeId?: string;
  placementRange?: number;
};
