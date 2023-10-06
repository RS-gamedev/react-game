import { EntityElementType } from "../../models/EntityElementType";
import { BuildingProps } from "../../models/BuildingProps"
import { Position } from "../../models/Position"

export type BuildingsContextProps = {
    buildings: EntityElementType[];
    addBuilding: (buildingId: BuildingProps, position: Position) => void;
    setBuildings: (buildings: EntityElementType[]) => void;
}