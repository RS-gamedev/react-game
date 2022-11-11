import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { Price } from "./Price"

export type BuildingProps = {
    id: string,
    price: Price[],
    icon: IconProp
    color: string,
    size: {
        width: string,
        heigth: string
    },
    position: {
        x: number,
        y: number
    }
}