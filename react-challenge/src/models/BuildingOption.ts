import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { Price } from "./Price"

export type BuildingOption = {
    price: Price[],
    icon: IconProp,
    name: string
    toExecute: () => void
}