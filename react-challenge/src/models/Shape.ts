import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { BuildingType } from "./enums/BuildingType";
import { Price } from "./Price";

export type Shape = {
    id: string,
    name: string,
    icon: IconProp,
    iconColor: string,
    image: string,
    selected: boolean
    price: Price[];
    type: BuildingType
}