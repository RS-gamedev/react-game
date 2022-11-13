import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { Position } from "./Position"
import { Price } from "./Price"
import { VillagerProps } from "./VillagerProps"

export type BuildingOption = {
    price: Price[],
    icon: IconProp,
    name: string
    toExecute: (position: Position) => VillagerProps
}