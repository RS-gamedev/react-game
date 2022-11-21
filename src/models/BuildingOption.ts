import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { Position } from "./Position"
import { Price } from "./Price"

export type BuildingOption = {
    id: string;
    price: Price[],
    icon?: IconProp,
    name: string
    toExecute: (position: Position) => any,
    imageName: string

}