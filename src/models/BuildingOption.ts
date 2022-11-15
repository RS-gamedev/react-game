import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { VillagerType } from "./enums/VillagerType"
import { Position } from "./Position"
import { Price } from "./Price"
import { VillagerProps } from "./VillagerProps"

export type BuildingOption = {
    id: string;
    price: Price[],
    icon?: IconProp,
    name: string
    toExecute: (position: Position) => any,
    type?: VillagerType;

}