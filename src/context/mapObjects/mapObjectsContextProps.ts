import { ObjectProps } from "../../models/ObjectProps"

export type MapObjectContextProps = {
    setMapObjects: (mapObjects: ObjectProps[]) => void
    mapObjects: ObjectProps[],
}