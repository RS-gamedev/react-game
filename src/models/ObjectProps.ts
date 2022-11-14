import { BuildingOption } from "./BuildingOption"

export type ObjectProps = {
    id: string,
    position: {
        x: number,
        y: number
    },
    name: string,
    selected: boolean;
    buildingOptions: BuildingOption[];
    
}