import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { BuildingOption } from "./BuildingOption";
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
    type: BuildingType,
    size: {width: number, height: number},
    buildingOptions: BuildingOption[]

}