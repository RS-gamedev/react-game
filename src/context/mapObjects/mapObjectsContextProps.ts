import { BuildingElementType } from "../../models/Building"
import { ObjectProps } from "../../models/ObjectProps";

export type MapObjectContextProps = {
    setMapObjects: (mapObjects: BuildingElementType[]) => void
    createMapObjects: (mapObjects: ObjectProps[]) => void;
    mapObjects: BuildingElementType[],
}