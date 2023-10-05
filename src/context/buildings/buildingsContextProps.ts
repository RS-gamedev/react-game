import { BuildingProps } from "../../models/BuildingProps"
import { Position } from "../../models/Position"

export type BuildingsContextProps = {
    buildings: BuildingProps[];
    addBuilding: (buildingId: BuildingProps, position: Position) => void;
    setBuildings: (buildings: BuildingProps[]) => void;
}