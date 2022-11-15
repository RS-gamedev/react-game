import { BuildingOption } from "./BuildingOption"
import { Hitbox } from "./Hitbox";

export type ObjectProps = {
    id: string,
    position: {
        x: number,
        y: number
    },
    name: string,
    selected: boolean;
    buildingOptions: BuildingOption[];
    hitBox: Hitbox
}