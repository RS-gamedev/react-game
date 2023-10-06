import { EntityElementType } from "../../models/EntityElementType"
import { ObjectProps } from "../../models/ObjectProps";

export type MapObjectContextProps = {
    setMapObjects: (mapObjects: EntityElementType[]) => void
    createMapObjects: (mapObjects: ObjectProps[]) => void;
    mapObjects: EntityElementType[],
}