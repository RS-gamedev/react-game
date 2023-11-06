import { BuildingProps } from "../../models/BuildingProps"
import { Position } from "../../models/Position"
import { BuildingEntity } from "../../models/BuildingEntity";

export type BuildingsContextProps = {
    buildings: BuildingEntity[];
    addBuilding: (buildingId: BuildingProps, position: Position) => void;
    setBuildings: (buildings: BuildingEntity[]) => void;
    selectBuilding: (buildingId: string) => void;
    deselectAllBuildings: () => void
    // nearestStorage: (position: Position) => string
    // nearest
}