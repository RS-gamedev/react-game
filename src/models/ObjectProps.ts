import { BuildingOption } from "./BuildingOption"
import { VillagerType } from "./enums/VillagerType";
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
    hitBox: Hitbox,
    type: VillagerType
}