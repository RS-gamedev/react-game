import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { BuildingType } from "./enums/BuildingType"
import { Price } from "./Price"

export type BuildingProps = {
    id: string,
    price: Price[],
    icon: IconProp,
    name: string,
    color: string,
    size: {
        width: string,
        height: string
    },
    position: {
        x: number,
        y: number
    },
    level: number,
    type: BuildingType,
    selected: boolean
}