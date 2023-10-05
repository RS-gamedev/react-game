import { BuildingElementType } from "../../models/Building";
import { BuildingProps } from "../../models/BuildingProps"
import { Position } from "../../models/Position"

export type BuildingsContextProps = {
    buildings: BuildingElementType[];
    addBuilding: (buildingId: BuildingProps, position: Position) => void;
    setBuildings: (buildings: BuildingElementType[]) => void;
}