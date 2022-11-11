import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { Price } from "./Price";

export type Shape = {
    id: string,
    name: string,
    icon: IconProp,
    iconColor: string,
    image: string,
    selected: boolean
    price: Price[];
}